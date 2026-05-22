import { type Request, type Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResposne";
import { issueService } from "./issue.service";


const createIssue = catchAsync(async (req: Request, res: Response) => {
  const id = req.user.id
  const result = await issueService.createIssueIntoDb({ req.body, id })
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