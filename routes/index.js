import path from 'path';
import mg from 'mailgun-js';
import request from 'request-promise';
import getPaymentEntity from '../helpers/getPaymentEntity';
import getPaymentSystemData from '../helpers/getPaymentSystemData';
import finishPayment from '../controllers/finishPayment';

const mailgun = mg({ apiKey: process.env.MAILGUN_API_KEY, domain: 'cases-billing.live' });

const MERCHANTS_URLS = {
  hp: {
    infoUrl: 'http://fast-credit.in/api/payment-success/',
    successUrl: 'http://fast-credit.in/payment-success/',
    failUrl: 'http://fast-credit.in/payment-fail/',
  },
  'fun-spin': {
    successUrl: 'https://fun-spin.com/by-coins/',
  },
};

export default ({ app }) => {
  app.get('/free-kassa/success', (req, res) => {
    res.redirect('https://fun-spin.com/by-coins');
  });
  app.all('/:paymentSystem/info/', async (req, res) => {
    const { params: { paymentSystem } } = req;
    const data = getPaymentSystemData({ req, paymentSystem });
    const paymentEntity = getPaymentEntity({ system: paymentSystem, data });
    try {
      await request({
        url: MERCHANTS_URLS[paymentEntity.merchant].infoUrl,
        method: 'POST',
        json: paymentEntity,
      });
      finishPayment({ paymentSystem, data, res });
    } catch (e) {
      res.status(400).send(e);
    }
  });
  app.all('/:paymentSystem/success/', (req, res) => {
    const { params: { paymentSystem } } = req;
    const data = getPaymentSystemData({ req, paymentSystem });
    const paymentEntity = getPaymentEntity({ system: paymentSystem, data });
    res.redirect(MERCHANTS_URLS[paymentEntity.merchant].successUrl);
  });
  app.all('/:paymentSystem/fail/', (req, res) => {
    const { params: { paymentSystem } } = req;
    const data = getPaymentSystemData({ req, paymentSystem });
    const paymentEntity = getPaymentEntity({ system: paymentSystem, data });
    res.redirect(MERCHANTS_URLS[paymentEntity.merchant].failUrl);
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
