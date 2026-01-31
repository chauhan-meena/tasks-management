import 'reflect-metadata';
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { NODE_ENV, PORT, ORIGIN, CREDENTIALS } from '@config';
import { API_CONFIG } from '@config/api.config';
import { swaggerSpec } from '@config/swagger.config';
import { connectDatabase } from '@database';
import { IRoute } from '@interfaces/routes.interface';
import { ErrorMiddleware } from '@middlewares/error.middleware';
import { logger, stream } from '@utils/logger';

export class App {
  public app: Application;
  public env: string;
  public port: string | number;

  constructor(routes: IRoute[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;

    this.initializeMiddlewares();
    this.initializeSwagger();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  public async listen(): Promise<void> {
    await this.connectToDatabase();

    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`App listening on port ${this.port}`);
      logger.info(`Swagger docs: http://localhost:${this.port}/api-docs`);
      logger.info(`=================================`);
    });
  }

  private async connectToDatabase(): Promise<void> {
    await connectDatabase();
  }

  private initializeMiddlewares(): void {
    this.app.use(morgan('dev', { stream }));
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS === 'true' }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeSwagger(): void {
    this.app.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec, {
        explorer: true,
        customSiteTitle: 'Tasks API Documentation',
        customCss: '.swagger-ui .topbar { display: none }',
        swaggerOptions: {
          persistAuthorization: true,
        },
      }),
    );

    // Endpoint to get swagger.json
    this.app.get('/api-docs.json', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerSpec);
    });
  }

  private initializeRoutes(routes: IRoute[]): void {
    const basePath = `${API_CONFIG.BASE_PATH}`;

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    routes.forEach((route) => {
      this.app.use(basePath, route.router);
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(ErrorMiddleware);
  }
}
