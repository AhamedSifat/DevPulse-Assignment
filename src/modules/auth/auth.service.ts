import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt from "jsonwebtoken";
import type { IUser } from "./auth.interface";
import env from "../../config/env";

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

const loginUserFromDb = async (payload: { email: string; password: string }) => {
  const { email, password } = payload;
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const isUserExit = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (isUserExit.rows.length === 0) {
    throw new Error('Invalid email or password');
  }

  const user = isUserExit.rows[0];
  const isPasswordMatch = await bcrypt.compare(String(password), user.password);
  if (!isPasswordMatch) {
    throw new Error('Invalid email or password');
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };

  const accessToken = jwt.sign(jwtPayload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
  const refreshToken = jwt.sign(jwtPayload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN });



  delete user.password;
  return { data: user, accessToken, refreshToken };
}

export const authService = {
  registerUserIntoDb,
  loginUserFromDb
}