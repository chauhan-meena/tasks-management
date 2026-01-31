import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { AuthService } from '@services/auth.service';
import { SignupDto, LoginDto } from '@dtos/auth.dto';
import { RequestWithUser } from '@interfaces/auth.interface';

export class AuthController {
  public authService = Container.get(AuthService);

  public signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: SignupDto = req.body;
      const { user, tokenData } = await this.authService.signup(userData);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user,
          token: tokenData.token,
          expiresIn: tokenData.expiresIn,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const loginData: LoginDto = req.body;
      const { user, tokenData } = await this.authService.login(loginData);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user,
          token: tokenData.token,
          expiresIn: tokenData.expiresIn,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public getProfile = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const user = await this.authService.getProfile(userId);

      res.status(200).json({
        success: true,
        message: 'Profile fetched successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };
}
