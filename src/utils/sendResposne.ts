import type { Response } from 'express';
import type { HTTP_STATUS } from '../config/httpStatus';

type TResponse<T> = {
  statusCode: typeof HTTP_STATUS[keyof typeof HTTP_STATUS];
  message: string;
  success: boolean;
  data?: T;
  errors?: any;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
    errors: data.errors,
  });
};

export default sendResponse;