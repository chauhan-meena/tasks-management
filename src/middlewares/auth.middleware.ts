import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/httpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import User from '@models/users.model';

const getAuthorization = (req: RequestWithUser): string | null => {
  const cookie = req.cookies['Authorization'];
  if (cookie) return cookie;

  const header = req.header('Authorization');
  if (header) {
    const parts = header.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      return parts[1];
    }
  }

  return null;
};

export const AuthMiddleware = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authorization = getAuthorization(req);

    if (!authorization) {
      next(new HttpException(401, 'Authentication token missing'));
      return;
    }

    const decoded = verify(authorization, SECRET_KEY) as DataStoredInToken;
    const user = await User.findOne({
      where: { id: decoded.id, is_deleted: false },
      attributes: ['id', 'email', 'name'],
    });

    if (!user) {
      next(new HttpException(401, 'Invalid authentication token'));
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    next();
  } catch (error) {
    next(new HttpException(401, 'Invalid authentication token'));
  }
};
