import { type Request, type Response, type NextFunction } from 'express';
import AppError from '../utils/AppError';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import env from '../config/env';
import { pool } from '../db';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization as string;

  console.log(req.headers);

  if (!token) {
    throw new AppError(401, "Missing authentication token");
  }

  const decode = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

  if (!decode || typeof decode === "string") {
    throw new AppError(401, "Invalid authentication token");
  }

  const userData = await pool.query(
    "SELECT id, email FROM users WHERE id = $1",
    [decode.id]
  );

  if (userData.rows.length === 0) {
    throw new AppError(401, "User not found");
  }

  const { password: _, ...user } = userData.rows[0];
  req.user = user;

  next();
};  
