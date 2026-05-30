import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/AuthMiddleware';
import { DashboardService } from '../services/DashboardService';
import { BaseController } from './BaseController';

export class DashboardController extends BaseController {
  private readonly dashboardService = new DashboardService();

  getDashboard = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const month = this.getMonthQuery(request.query.month);
      const result = await this.dashboardService.getDashboard(request.user!.userId, month);
      this.successResponse(response, 'Dashboard fetched successfully', result);
    } catch (error) {
      next(error);
    }
  };

  getPersonalIncome = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.dashboardService.getPersonalIncome(request.user!.userId);
      this.successResponse(response, 'Personal income fetched successfully', result);
    } catch (error) {
      next(error);
    }
  };

  getPersonalExpenses = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.dashboardService.getPersonalExpenses(request.user!.userId);
      this.successResponse(response, 'Personal expenses fetched successfully', result);
    } catch (error) {
      next(error);
    }
  };

  getPersonalBalance = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.dashboardService.getPersonalBalance(request.user!.userId);
      this.successResponse(response, 'Personal balance fetched successfully', result);
    } catch (error) {
      next(error);
    }
  };

  getMonthlySummary = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const month = this.getMonthQuery(request.query.month);
      const result = await this.dashboardService.getMonthlySummary(request.user!.userId, month);
      this.successResponse(response, 'Monthly summary fetched successfully', result);
    } catch (error) {
      next(error);
    }
  };

  getCategoryBreakdown = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const month = this.getMonthQuery(request.query.month);
      const result = await this.dashboardService.getCategoryBreakdown(request.user!.userId, month);
      this.successResponse(response, 'Category breakdown fetched successfully', result);
    } catch (error) {
      next(error);
    }
  };

  getBudgetOverview = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const month = this.getMonthQuery(request.query.month);
      const result = await this.dashboardService.getBudgetOverview(request.user!.userId, month);
      this.successResponse(response, 'Budget overview fetched successfully', result);
    } catch (error) {
      next(error);
    }
  };

  private getMonthQuery(value: unknown): string | undefined {
    if (!value) {
      return undefined;
    }

    if (Array.isArray(value)) {
      return value[0];
    }

    return String(value);
  }
}
