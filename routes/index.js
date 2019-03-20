import path from 'path';
import mg from 'mailgun-js';
import request from 'request-promise';
import getPaymentEntity from '../helpers/getPaymentEntity';
import getPaymentSystemData from '../helpers/getPaymentSystemData';
import { finishPaymentSuccess, finishPaymentError } from '../controllers/finishPayment';

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
    console.log('-------info', req.body);
    console.log('-------info', req.query);
    const { params: { paymentSystem } } = req;
    const data = getPaymentSystemData({ req, paymentSystem });
    const paymentEntity = getPaymentEntity({ paymentSystem, data });
    if (paymentEntity.status !== 'done') return finishPaymentError({ paymentSystem, data, res });
    try {
      await request({
        url: MERCHANTS_URLS[paymentEntity.merchant].infoUrl,
        method: 'POST',
        json: paymentEntity,
      });
      return finishPaymentSuccess({ paymentSystem, data, res });
    } catch (e) {
      console.log(e);
      return finishPaymentError({ paymentSystem, data, res });
    }
  });
  app.all('/:paymentSystem/success/', (req, res) => {
    console.log('-------success', req.body);
    console.log('-------success', req.query);
    const { params: { paymentSystem } } = req;
    const data = getPaymentSystemData({ req, paymentSystem });
    const paymentEntity = getPaymentEntity({ paymentSystem, data });
    res.redirect(MERCHANTS_URLS[paymentEntity.merchant].successUrl);
  });
  app.all('/:paymentSystem/fail/', (req, res) => {
    const { params: { paymentSystem } } = req;
    const data = getPaymentSystemData({ req, paymentSystem });
    const paymentEntity = getPaymentEntity({ paymentSystem, data });
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
