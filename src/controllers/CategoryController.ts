import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/AuthMiddleware';
import { CategoryService } from '../services/CategoryService';
import { ResponseUtil } from '../utils/ResponseUtil';

export class CategoryController {
  private readonly categoryService = new CategoryService();

  list = async (_request: AuthenticatedRequest, response: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.categoryService.list();
      ResponseUtil.success(response, 'Categories fetched successfully', result);
    } catch (error) {
      next(error);
    }
  };

  getById = async (request: AuthenticatedRequest, response: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.categoryService.getById(String(request.params.id));
      ResponseUtil.success(response, 'Category fetched successfully', result);
    } catch (error) {
      next(error);
    }
  };

  create = async (request: AuthenticatedRequest, response: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.categoryService.create(request.body);
      ResponseUtil.success(response, 'Category created successfully', result, 201);
    } catch (error) {
      next(error);
    }
  };

  update = async (request: AuthenticatedRequest, response: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.categoryService.update(String(request.params.id), request.body);
      ResponseUtil.success(response, 'Category updated successfully', result);
    } catch (error) {
      next(error);
    }
  };

  delete = async (request: AuthenticatedRequest, response: Response, next: NextFunction): Promise<void> => {
    try {
      await this.categoryService.delete(String(request.params.id));
      ResponseUtil.success(response, 'Category deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}
