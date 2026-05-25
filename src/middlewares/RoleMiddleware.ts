import { NextFunction, Response } from 'express';
import { UserRole } from '../entities';
import { AuthenticatedRequest } from './AuthMiddleware';

export const roleMiddleware = (...allowedRoles: UserRole[]) => {
  return (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): void => {
    if (!request.user) {
      response.status(401).json({
        success: false,
        message: 'Unauthorized access. JWT token is required.',
      });
      return;
    }

    if (!allowedRoles.includes(request.user.role)) {
      response.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to access this resource.',
      });
      return;
    }

    next();
  };
};
