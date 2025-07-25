import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import config from '../config';

import { User } from '../modules/User/user.model';

const auth = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // checking if the token is missing
    if (!token) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized!');
    }

    // Extract the token from Bearer format
    const tokenWithoutBearer = token.startsWith('Bearer ')
      ? token.split(' ')[1]
      : token;

    // checking if the given token is valid
    let decoded;
    try {
      decoded = jwt.verify(
        tokenWithoutBearer,
        config.jwt_access_secret as string,
      ) as JwtPayload;
    } catch (err) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'Unauthorized');
    }

    const { email, id } = decoded;

    // checking if the user is exist
    const user = await User.isUserExistsByEmail(email);

    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, 'This user is not found !');
    }
    // Check if user is active
    if (!user.isActive) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        'Your account has been deactivated. Please contact support.',
      );
    }

    req.user = { ...decoded, id: id || user._id } as JwtPayload & {
      id: string;
      email: string;
    };
    next();
  });
};

export default auth;
