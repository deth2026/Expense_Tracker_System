import { Response } from 'express';
import { ResponseUtil } from '../utils/ResponseUtil';

export abstract class BaseController {
  protected successResponse(
    response: Response,
    message: string,
    data?: unknown,
    status = 200,
  ): void {
    ResponseUtil.success(response, message, data, status);
  }

  protected errorResponse(response: Response, message: string, status = 400): void {
    response.status(status).json({
      success: false,
      message,
    });
  }
}
