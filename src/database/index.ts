import { Sequelize } from 'sequelize';
import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, NODE_ENV } from '@config';
import { logger } from '@utils/logger';

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: parseInt(DB_PORT, 10),
  dialect: 'mysql',
  logging: NODE_ENV === 'development' ? (msg) => logger.debug(msg) : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true,
    underscored: true,
  },
});

export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully.');

    await sequelize.sync({ alter: NODE_ENV === 'development' });
    logger.info('Database models synchronized.');
  } catch (error: any) {
    console.error('Database Error:', error.message || error);
    logger.error(`Unable to connect to the database: ${error.message}`);
    throw error;
  }
};

export { sequelize };
export default sequelize;
