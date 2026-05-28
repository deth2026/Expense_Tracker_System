import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/AuthMiddleware';
import { BudgetService } from '../services/BudgetService';
import { ResponseUtil } from '../utils/ResponseUtil';

export class BudgetController {
  private readonly budgetService = new BudgetService();

  list = async (request: AuthenticatedRequest, response: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.budgetService.list(request.user?.userId ?? '');
      ResponseUtil.success(response, 'Budgets fetched successfully', result);
    } catch (error) {
      next(error);
    }
  };

  getById = async (request: AuthenticatedRequest, response: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.budgetService.getById(
        String(request.params.id),
        request.user?.userId ?? '',
      );
      ResponseUtil.success(response, 'Budget fetched successfully', result);
    } catch (error) {
      next(error);
    }
  };

  create = async (request: AuthenticatedRequest, response: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.budgetService.create(request.user?.userId ?? '', request.body);
      ResponseUtil.success(response, 'Budget created successfully', result, 201);
    } catch (error) {
      next(error);
    }
  };

  update = async (request: AuthenticatedRequest, response: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.budgetService.update(
        String(request.params.id),
        request.user?.userId ?? '',
        request.body,
      );
      ResponseUtil.success(response, 'Budget updated successfully', result);
    } catch (error) {
      next(error);
    }
  };

  delete = async (request: AuthenticatedRequest, response: Response, next: NextFunction): Promise<void> => {
    try {
      await this.budgetService.delete(String(request.params.id), request.user?.userId ?? '');
      ResponseUtil.success(response, 'Budget deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}
