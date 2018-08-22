import express from 'express';
import expressSslify from 'express-sslify';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';
import routes from './routes';

require('dotenv').config();

const app = express();
if (process.env.NODE_ENV === 'production') app.use(expressSslify.HTTPS({ trustProtoHeader: true }));
app.use(cors({
  credentials: true,
}));
app.use(cookieParser());
app.use(bodyParser.json({ extended: true }));

app.use(express.static(path.join(__dirname, 'client'), { index: false, extensions: false, redirect: false }));

routes({ app });

app.listen(process.env.PORT, () => console.log(`REST started on port ${process.env.PORT}`));

process.on('SIGTERM', () => {
  console.log('SIGTERM');
  return process.exit(0);
});

