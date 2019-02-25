import path from 'path';
import mg from 'mailgun-js';

const mailgun = mg({ apiKey: process.env.MAILGUN_API_KEY, domain: 'cases-billing.live' });

export default ({ app }) => {
  app.get('/free-kassa/success', (req, res) => {
    res.redirect('https://fun-spin.com/by-coins');
  });
  app.get('/hp/:paymentSystem/success/', (req, res) => {
    console.log(`Payment success ${req.params.paymentSystem}`);
    res.send(200);
  });
  app.post('/by', async (req, res) => {
    const { email, product } = req.body;

    const data = {
      from: 'Web Guru <b30c3756cca4616d59b1@cloudmailin.net>',
      to: email,
      subject: 'Купон от WebGuru',
      text: `Вы успешно совершили оплату купона со скидкой -20% на разработку продукта "${product}". В течении суток, наш менеджер свяжется с вами для уточнения деталей по вашему проекту.`,
    };

    mailgun.messages().send(data, (error, body) => {
      if (error) {
        console.log(body);
        res.status(500).send(error);
      } else {
        console.log(body);
        res.send(200);
      }
    });
  });
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'client', 'index.html'));
  });
};
