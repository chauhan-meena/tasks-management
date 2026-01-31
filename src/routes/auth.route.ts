import { Router } from 'express';
import { AuthController } from '@controllers/auth.controller';
import { SignupDto, LoginDto } from '@dtos/auth.dto';
import { IRoute } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { API_CONFIG } from '@config/api.config';

export class AuthRoute implements IRoute {
  public path = API_CONFIG.ROUTES.AUTH;
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      `${this.path}/signup`,
      ValidationMiddleware(SignupDto),
      this.authController.signup,
    );

    this.router.post(
      `${this.path}/login`,
      ValidationMiddleware(LoginDto),
      this.authController.login,
    );

    this.router.get(
      `${this.path}/profile`,
      AuthMiddleware,
      this.authController.getProfile,
    );
  }
}
