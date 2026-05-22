import { HTTP_STATUS } from "../../config/httpStatus";
import { pool } from "../../db";
import type { Usertype } from "../../types";
import AppError from './../../utils/AppError';
import type { CreateIssuePayload, IssueFilters } from "./issue.interface";



const createIssueIntoDb = async (payload: CreateIssuePayload) => {
  const { title, description, id, type } = payload
  if (!title || !description || !type) {
    throw new AppError(400, "Title, description, and type are required")
  }

  if (!['bug', 'feature_request'].includes(type)) {
    throw new AppError(400, "Invalid issue type. Must be 'bug' or 'feature_request'")
  }
  const issue = await pool.query(
    "INSERT INTO issues (title, description, reporter_id, type) VALUES ($1, $2, $3, $4) RETURNING *",
    [title, description, id, type]
  );
  return issue.rows[0];

}

const updateIssueIntoDb = async (id: string, payload: Partial<CreateIssuePayload>, user: Omit<Usertype, 'password'>) => {
  const { title, description, type } = payload

  const existingIssueResult = await pool.query("SELECT * FROM issues WHERE id = $1", [id]);

  if (existingIssueResult.rows.length === 0) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "Issue not found");

  }
  const isMaintainer = user.role === "maintainer";
  const isOwner = existingIssueResult.rows[0].reporter_id === user.id;

  if (!isMaintainer) {
    if (!isOwner) {
      throw new AppError(403, "You cannot update this issue");
    }

    if (existingIssueResult.rows[0].status !== "open") {
      throw new AppError(403, "Only open issues can be updated");
    }
  }


  if (type && !['bug', 'feature_request'].includes(type)) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, "Invalid issue type. Must be 'bug' or 'feature_request'")
  }


  const update = await pool.query(
    "UPDATE issues SET title = COALESCE($1, title), description = COALESCE($2, description), type = COALESCE($3, type), updated_at = NOW() WHERE reporter_id = $4 RETURNING *",
    [title, description, type, id]
  );
  return update.rows[0];
}

const getIssuesFromDb = async (filters: IssueFilters) => {
  const { sort = 'newest', type, status } = filters;

  let query = "SELECT * FROM issues";
  const params: any[] = [];
  const conditions: string[] = [];

  if (type) {
    params.push(type);
    conditions.push(`type = $${params.length}`);
  }

  if (status) {
    params.push(status);
    conditions.push(`status = $${params.length}`);
  }

  if (conditions.length) {
    query += " WHERE " + conditions.join(" AND ");
  }

  if (sort === 'newest') {
    query += " ORDER BY created_at DESC";
  } else if (sort === 'oldest') {
    query += " ORDER BY created_at ASC";
  }

  const issuesResult = await pool.query(query, params);
  const issues = issuesResult.rows;

  if (issues.length === 0) return [];

  const reporterIds = [...new Set(issues.map(issue => issue.reporter_id))];

  const usersResult = await pool.query(
    "SELECT id, name, role FROM users WHERE id = ANY($1)",
    [reporterIds]
  );

  const users = usersResult.rows;

  const userMap = new Map(users.map(u => [u.id, u]));

  const formatted = issues.map(issue => ({
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter: userMap.get(issue.reporter_id)
      ? {
        id: userMap.get(issue.reporter_id).id,
        name: userMap.get(issue.reporter_id).name,
        role: userMap.get(issue.reporter_id).role,
      }
      : null,
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  }));

  return formatted;
};

const getIssueByIdFromDb = async (id: string) => {
  const issueResult = await pool.query("SELECT * FROM issues WHERE id = $1", [id]);

  if (issueResult.rows.length === 0) {
    throw new AppError(404, "Issue not found");
  }
  const issue = issueResult.rows[0];
  const reporterResult = await pool.query("SELECT id, name, role FROM users WHERE id = $1", [issue.reporter_id]);

  const reporter = reporterResult.rows[0] || null;

  const formatted = {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter: reporter
      ? {
        id: reporter.id,
        name: reporter.name,
        role: reporter.role,
      }
      : null,
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  };
  return formatted;
};
const deleteIssueFromDb = async (id: string) => {
  const issueResult = await pool.query("SELECT * FROM issues WHERE id = $1", [id]);

  if (issueResult.rows.length === 0) {
    throw new AppError(404, "Issue not found");
  }

  await pool.query("DELETE FROM issues WHERE id = $1", [id]);
}



export const issueService = {
  createIssueIntoDb
  , getIssuesFromDb
  , getIssueByIdFromDb
  , deleteIssueFromDb
  , updateIssueIntoDb
}