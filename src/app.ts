import compression from 'compression';
import cors from 'cors';
import express, { type Express } from 'express';
import { xss } from 'express-xss-sanitizer';
import helmet from 'helmet';
import passport from 'passport';
import { notFoundController } from './common/http/notFoundController.ts';
import errorHandler from './common/middleware/errorHandler.ts';
import config from './configuration/config.ts';
import morgan from './configuration/morgan.ts';
import { jwtStrategy } from './configuration/passport.ts';
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

app.use(compression());

app.use(cors());

passport.use(jwtStrategy);

app.use('/api/v1', router);
app.use('*fallback', notFoundController);
app.use(errorHandler);

export default app;
