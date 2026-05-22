import { type Request, type Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResposne";
import { issueService } from "./issue.service";
import AppError from "../../utils/AppError";


const createIssue = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
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

export const issueController = {
  createIssue
}