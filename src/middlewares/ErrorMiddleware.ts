import { NextFunction, Request, Response } from 'express';

export class HttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction,
): void => {
  if (error instanceof HttpError) {
    response.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }

  response.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};
