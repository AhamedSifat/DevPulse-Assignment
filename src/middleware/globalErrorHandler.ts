import { type Request, type Response } from 'express';
import AppError from '../utils/AppError';
import { HTTP_STATUS } from '../config/httpStatus';

const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
) => {

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errors: error.stack,
    });
  }

  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: error.message || 'Internal Server Error',
    errors: error.stack,

  });
};

export default globalErrorHandler;