import path from 'path';
import nodemailer from 'nodemailer';

export default ({ app }) => {
  app.get('/free-kassa/success', (req, res) => {
    res.redirect('https://fun-spin.com/by-coins');
  });
  app.get('/hp/adv-cash/success/', (req, res) => {
    res.redirect('https://fast-credit.in');
  });
  app.post('/by', async (req, res) => {
    const { email, product } = req.body;
    const transporter = nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 25,
      auth: {
        user: '3e74387325b233',
        pass: 'fda44516dcc8d1',
      },
    });

    const mailOptions = {
      from: '"WebGuru" <2b24d8fe66-c306cf@inbox.mailtrap.io>',
      to: email,
      subject: 'Купон от WebGuru',
      text: `Вы успешно совершили оплату купона на скидку -20% на разработку продукта "${product}". В течении суток, наш менеджер свяжется с вами для уточнения деталей по вашему проекту.`,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.send(200);
    } catch (e) {
      console.log(e);
      res.send(500);
    }
  });
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'client', 'index.html'));
  });
};
