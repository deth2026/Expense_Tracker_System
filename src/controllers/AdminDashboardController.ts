import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/AuthMiddleware';
import { AdminDashboardService } from '../services/AdminDashboardService';
import { BaseController } from './BaseController';

export class AdminDashboardController extends BaseController {
  private readonly adminDashboardService = new AdminDashboardService();

  getDashboard = async (
    _request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.adminDashboardService.getDashboard();
      this.successResponse(response, 'Admin dashboard fetched successfully', result);
    } catch (error) {
      next(error);
    }
  };
}
