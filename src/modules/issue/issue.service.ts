import { pool } from "../../db";
import AppError from './../../utils/AppError';
import type { CreateIssuePayload } from "./issue.interface";



const createIssueIntoDb = async (payload: CreateIssuePayload) => {
  const { title, description, id, type } = payload
  if (!title || !description || !type) {
    throw new AppError(400, "Title, description, and type are required")
  }

  if (![ 'bug', 'feature_request'].includes(type)) {
    throw new AppError(400, "Invalid issue type. Must be 'bug' or 'feature_request'")
  }
  const issue = await pool.query(
    "INSERT INTO issues (title, description, reporter_id, type) VALUES ($1, $2, $3, $4) RETURNING *",
    [title, description, id, type]
  );
  return issue.rows[0];

}

export const issueService = {
  createIssueIntoDb
}