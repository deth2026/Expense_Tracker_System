import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/AuthMiddleware';
import { HttpError } from '../middlewares/ErrorMiddleware';
import { UserService } from '../services/UserService';
import { BaseController } from './BaseController';

export class UserController extends BaseController {
  private readonly userService = new UserService();

  getProfile = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.userService.getProfile(request.user!.userId);
      this.successResponse(response, 'Profile fetched successfully', result);
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.userService.updateProfile(request.user!.userId, request.body);
      this.successResponse(response, 'Profile updated successfully', result);
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await this.userService.changePassword(request.user!.userId, request.body);
      this.successResponse(response, 'Password changed successfully');
    } catch (error) {
      next(error);
    }
  };

  deleteProfile = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await this.userService.deleteProfile(request.user!.userId);
      this.successResponse(response, 'Profile deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  listUsers = async (
    _request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.userService.listUsers();
      this.successResponse(response, 'Users fetched successfully', result);
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const rawUserId = request.params.id;
      const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;

      if (!userId) {
        throw new HttpError(400, 'User id is required');
      }

      const result = await this.userService.getUserById(userId);
      this.successResponse(response, 'User fetched successfully', result);
    } catch (error) {
      next(error);
    }
  };
}
