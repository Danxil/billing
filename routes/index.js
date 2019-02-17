import path from 'path';
import sendgrid from 'sendgrid';

const sgHelper = sendgrid.mail;
const sg = sendgrid('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');


export default ({ app }) => {
  app.get('/free-kassa/success', (req, res) => {
    res.redirect('https://fun-spin.com/by-coins');
  });
  app.get('/hp/adv-cash/success/', (req, res) => {
    res.redirect('https://fast-credit.in');
  });
  app.post('/by', async (req, res) => {
    const { email, product } = req.body;

    const mail = new sgHelper.Mail(
      new sgHelper.Email('danxilggggaa@cases-billing.live'),
      'Купон от WebGuru',
      new sgHelper.Email(email),
      new sgHelper.Content(
        'text/plain',
        `Вы успешно совершили оплату купона со скидкой -20% на разработку продукта "${product}". В течении суток, наш менеджер свяжется с вами для уточнения деталей по вашему проекту.`,
      ),
    );

    const request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON(),
    });

    sg.API(request, (error) => {
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
