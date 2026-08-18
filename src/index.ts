import 'reflect-metadata';

import app from './app.ts';
import config from './configuration/config.ts';
import logger from './configuration/logger.ts';
import { pool } from './configuration/postgres.ts';
import { AppDataSource } from './configuration/typeorm.ts';

async function main() {
  await pool
    .query('SELECT 1')
    .then(async () => {
      await AppDataSource.initialize();
      app.listen(config.PORT, config.HOST, () => {
        logger.info(`App is running on http://${config.HOST}:${config.PORT}`);
      });
    })
    .catch((reason) => {
      logger.error('Failed to start application' + reason);
      process.exit(1);
    });
}

void main();
