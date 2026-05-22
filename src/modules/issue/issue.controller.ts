import { type Request, type Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResposne";
import { issueService } from "./issue.service";
import AppError from "../../utils/AppError";
import { HTTP_STATUS } from "../../config/httpStatus";


const createIssue = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized");
  }


  if (!req.body) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      'Request body is required'
    );
  }

  const { id } = req.user
  const result = await issueService.createIssueIntoDb({ ...req.body, id })
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Issue created successfully",
    data: result
  })
});

const getIssues = catchAsync(async (req: Request, res: Response) => {
  const { sort = 'newest', type, status } = req.query;

  const result = await issueService.getIssuesFromDb({
    sort: sort as string,
    type: type as string | undefined,
    status: status as string | undefined,
  })
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    success: true,
    data: result
  })
}
)

export const issueController = {
  createIssue
  , getIssues
}