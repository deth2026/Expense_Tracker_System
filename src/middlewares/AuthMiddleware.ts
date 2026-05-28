import { NextFunction, Request, Response } from 'express';
import { JwtPayloadData, JwtUtil } from '../utils/JwtUtil';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayloadData;
}

export const authMiddleware = (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction,
): void => {
  const authorization = request.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    response.status(401).json({
      success: false,
      message: 'Unauthorized access. JWT token is required.',
    });
    return;
  }

  const token = authorization.split(' ')[1];

  try {
    request.user = JwtUtil.verify(token);
    next();
  } catch (_error) {
    response.status(401).json({
      success: false,
      message: 'Unauthorized access. Invalid or expired token.',
    });
  }
};
