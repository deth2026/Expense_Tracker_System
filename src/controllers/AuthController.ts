import { NextFunction, Request, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/AuthMiddleware';
import { AuthService } from '../services/AuthService';
import { ResponseUtil } from '../utils/ResponseUtil';

export class AuthController {
  private readonly authService = new AuthService();

  register = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.register(request.body);
      ResponseUtil.success(response, 'User registered successfully', result, 201);
    } catch (error) {
      next(error);
    }
  };

  loginUser = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.loginUser(request.body);
      ResponseUtil.success(response, 'User login successful', result);
    } catch (error) {
      next(error);
    }
  };

  loginAdmin = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.loginAdmin(request.body);
      ResponseUtil.success(response, 'Admin login successful', result);
    } catch (error) {
      next(error);
    }
  };

  me = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.authService.getCurrentUser(request.user!.userId);
      ResponseUtil.success(response, 'Current user fetched successfully', result);
    } catch (error) {
      next(error);
    }
  };
}
