import { type Request, type Response } from "express";
import { authService } from "./auth.service";
import sendResponse from "../../utils/sendResposne";
import { HTTP_STATUS } from "../../config/httpStatus";

const registerUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.registerUserIntoDb(req.body);


    sendResponse(res, {
      statusCode: HTTP_STATUS.CREATED,
      message: "User registered successfully",
      success: true,
      data: result
    });

  } catch (error) {
    if (error instanceof Error) {
      sendResponse(res, {
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        message: error.message,
        success: false,
        errors: error.stack
      });
    }

  }
};


const loginUser = async (req: Request, res: Response) => {
  try {
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

  } catch (error) {
    if (error instanceof Error) {
      sendResponse(res, {
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        message: error.message,
        success: false,
        errors: error.stack
      });
    }
  }
}

export const authController = {
  registerUser,
  loginUser
};