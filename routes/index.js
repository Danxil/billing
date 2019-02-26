import path from 'path';
import mg from 'mailgun-js';
import request from 'request-promise';
import paymentSuccess from '../controllers/paymentSuccess';

const mailgun = mg({ apiKey: process.env.MAILGUN_API_KEY, domain: 'cases-billing.live' });

const MERCHANTS_URLS = {
  hp: {
    infoUrl: 'http://fast-credit.in/api/payment-success',
    successUrl: 'http://fast-credit.in/cabinet',
  },
  'fun-spin': {
    successUrl: 'https://fun-spin.com/by-coins',
  },
};

export default ({ app }) => {
  app.get('/free-kassa/success', (req, res) => {
    res.redirect('https://fun-spin.com/by-coins');
  });
  app.post('/:paymentSystem/info/', async ({ params: { paymentSystem }, body }, res) => {
    const paymentEntity = paymentSuccess({ system: paymentSystem, body });
    try {
      await request({
        url: MERCHANTS_URLS[paymentEntity.merchant].infoUrl,
        method: 'POST',
        json: paymentEntity,
      });
      res.send(200);
    } catch (e) {
      res.status(400).send(e);
    }
  });
  app.post('/:paymentSystem/success', ({ params: { paymentSystem }, body }, res) => {
    const paymentEntity = paymentSuccess({ system: paymentSystem, body });
    res.redirect(MERCHANTS_URLS[paymentEntity.merchant].redirectUrl);
  });
  app.post('/by', async (req, res) => {
    const { email, product } = req.body;

    const data = {
      from: 'Web Guru <b30c3756cca4616d59b1@cloudmailin.net>',
      to: email,
      subject: 'Купон от WebGuru',
      text: `Вы успешно совершили оплату купона со скидкой -20% на разработку продукта "${product}". В течении суток, наш менеджер свяжется с вами для уточнения деталей по вашему проекту.`,
    };

    mailgun.messages().send(data, (error) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.send(200);
      }
    });
  });
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'client', 'index.html'));
  });
};
