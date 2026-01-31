import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env') });

export const {
  NODE_ENV = 'development',
  PORT = '3000',
  DB_HOST = 'localhost',
  DB_PORT = '3306',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'tasks_db',
  SECRET_KEY = 'secretKey',
  LOG_FORMAT = 'dev',
  LOG_DIR = '../logs',
  ORIGIN = '*',
  CREDENTIALS = 'true',
} = process.env;
