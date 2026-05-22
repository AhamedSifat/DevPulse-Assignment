import { type Request, type Response } from "express";
import { authService } from "./auth.service";
import sendResponse from "../../utils/sendResposne";
import { HTTP_STATUS } from "../../config/httpStatus";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../utils/AppError";

const registerUser = catchAsync(async (req: Request, res: Response) => {

  if (!req.body || Object.keys(req.body).length === 0) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      'Request body is required'
    );
  }
  const result = await authService.registerUserIntoDb(req.body);


  sendResponse(res, {
    statusCode: HTTP_STATUS.CREATED,
    message: "User registered successfully",
    success: true,
    data: result
  });

});


const loginUser = catchAsync(async (req: Request, res: Response) => {


  if (!req.body || Object.keys(req.body).length === 0) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      'Request body is required'
    );
  }

  const result = await authService.loginUserFromDb(req.body);

  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: "Login successful",
    success: true,
    data: {
      user: result.data,
      token: result.accessToken,
    }
  });

}
);

export const authController = {
  registerUser,
  loginUser
};