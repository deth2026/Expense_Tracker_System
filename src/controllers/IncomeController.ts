import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/AuthMiddleware';
import { IncomeService } from '../services/IncomeService';
import { BaseController } from './BaseController';

export class IncomeController extends BaseController {
  private readonly incomeService = new IncomeService();

  createIncome = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.incomeService.createIncome(request.user!.userId, request.body);
      this.successResponse(response, 'Income added successfully', result, 201);
    } catch (error) {
      next(error);
    }
  };

  listIncomes = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.incomeService.listIncomes(request.user!.userId);
      this.successResponse(response, 'Income fetched successfully', result);
    } catch (error) {
      next(error);
    }
  };

  getIncomeById = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const incomeId = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
      const result = await this.incomeService.getIncomeById(request.user!.userId, incomeId);
      this.successResponse(response, 'Income fetched successfully', result);
    } catch (error) {
      next(error);
    }
  };

  updateIncome = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const incomeId = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
      const result = await this.incomeService.updateIncome(
        request.user!.userId,
        incomeId,
        request.body,
      );
      this.successResponse(response, 'Income updated successfully', result);
    } catch (error) {
      next(error);
    }
  };

  deleteIncome = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const incomeId = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
      await this.incomeService.deleteIncome(request.user!.userId, incomeId);
      this.successResponse(response, 'Income deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}
