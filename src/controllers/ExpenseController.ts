import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/AuthMiddleware';
import { ExpenseService } from '../services/ExpenseService';
import { BaseController } from './BaseController';

export class ExpenseController extends BaseController {
  private readonly expenseService = new ExpenseService();

  createExpense = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.expenseService.createExpense(request.user!.userId, request.body);
      this.successResponse(response, 'Expense added successfully', result, 201);
    } catch (error) {
      next(error);
    }
  };

  listExpenses = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.expenseService.listExpenses(request.user!.userId);
      this.successResponse(response, 'Expenses fetched successfully', result);
    } catch (error) {
      next(error);
    }
  };

  searchExpenses = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.expenseService.searchExpenses(request.user!.userId, {
        q: typeof request.query.q === 'string' ? request.query.q : undefined,
        categoryId:
          typeof request.query.categoryId === 'string' ? request.query.categoryId : undefined,
        from: typeof request.query.from === 'string' ? request.query.from : undefined,
        to: typeof request.query.to === 'string' ? request.query.to : undefined,
      });
      this.successResponse(response, 'Expenses searched successfully', result);
    } catch (error) {
      next(error);
    }
  };

  getExpenseById = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.expenseService.getExpenseById(
        request.user!.userId,
        String(request.params.id),
      );
      this.successResponse(response, 'Expense fetched successfully', result);
    } catch (error) {
      next(error);
    }
  };

  updateExpense = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.expenseService.updateExpense(
        request.user!.userId,
        String(request.params.id),
        request.body,
      );
      this.successResponse(response, 'Expense updated successfully', result);
    } catch (error) {
      next(error);
    }
  };

  deleteExpense = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await this.expenseService.deleteExpense(request.user!.userId, String(request.params.id));
      this.successResponse(response, 'Expense deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}
