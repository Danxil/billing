import path from 'path';

export default ({ app }) => {
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'client', 'index.html'));
  });
  app.get('/free-kassa/success', (req, res) => {
    res.redirect('https://fun-spin.com/by-coins');
  });
};
