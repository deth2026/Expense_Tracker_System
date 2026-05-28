import { Response } from 'express';

export class ResponseUtil {
  static success(response: Response, message: string, data?: unknown, status = 200): void {
    response.status(status).json({
      success: true,
      message,
      data,
    });
  }
}
