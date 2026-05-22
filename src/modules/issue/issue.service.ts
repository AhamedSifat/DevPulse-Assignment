import { pool } from "../../db";
import AppError from './../../utils/AppError';
import type { CreateIssuePayload } from "./issue.interface";



const createIssueIntoDb = async (payload: CreateIssuePayload) => {
  const { title, description, id } = payload
  if (!title || !description) {
    throw new AppError(400, "Title and description are required")
  }
  const issue = await pool.query(
    "INSERT INTO issues (title, description, created_by) VALUES ($1, $2, $3) RETURNING *",
    [title, description, id]
  );
  return issue.rows[0];

}

export const issueService = {
  createIssueIntoDb
}