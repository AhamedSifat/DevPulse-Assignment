import bcrypt from "bcryptjs";
import { pool } from "../../db";
import type { IUser } from "./auth.interface";

const registerUserIntoDb = async (playload: IUser) => {
  const { name, email, password, role } = playload;
  if (!name || !email || !password || !role) {
    throw new Error('Name, email, password, and role are required');
  }
  if (!['contributor', 'maintainer'].includes(role)) {
    throw new Error('Role must be either contributor or maintainer');
  }

  const hashedPassword = await bcrypt.hash(String(password), 10);
  const result = await pool.query(
    'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, email, hashedPassword, role],
  );
  delete result.rows[0].password;
  return result.rows[0];
};



export const authService = {
  registerUserIntoDb
}