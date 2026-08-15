import cors from 'cors';
import express, { type Express } from 'express';
import { xss } from 'express-xss-sanitizer';
import helmet from 'helmet';
import config from './configuration/config.ts';
import morgan from './configuration/morgan.ts';
import router from './routes/v1/index.ts';

const app: Express = express();

if (config.NODE_ENV !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(xss());

app.use(cors());

app.use('/api/v1', router);

export default app;
