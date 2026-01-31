import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/httpException';
import { logger } from '@utils/logger';

export const ErrorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const status: number = error.status || 500;
  const message: string = error.message || 'Something went wrong';

  logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);

  res.status(status).json({
    success: false,
    status,
    message,
  });
};
