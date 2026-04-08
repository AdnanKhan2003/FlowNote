import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq, and } from "drizzle-orm";
import { asyncHandler } from "../lib/asyncHandler.js";
import APIResponse from "../lib/APIResponse.js";
import APIError from "../lib/APIError.js";
import {
  OK,
  CREATED,
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
} from "../constants/http.js";
import { JWT_SECRET } from "../constants/env.js";
import { BCRYPT_SALT_ROUNDS } from "../constants/constants.js";
import logger from "../lib/logger.js";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (existingUser.length > 0) {
    throw new APIError(BAD_REQUEST, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  const newUser = await db
    .insert(users)
    .values({
      email,
      password: hashedPassword,
      role: "EDITOR",
    })
    .returning();

  logger.info(`User registered successfully: ${email}`);

  res
    .status(CREATED)
    .json(
      new APIResponse(
        CREATED,
        { id: newUser[0].id, email: newUser[0].email, role: newUser[0].role },
        "User registered successfully",
      ),
    );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await db
    .select()
    .from(users)
    .where(and(eq(users.email, email), eq(users.role, "EDITOR")))
    .limit(1);

  if (user.length === 0) {
    logger.warn(`Login failed: Invalid credentials or non-editor access attempt for ${email}`);
    throw new APIError(
      UNAUTHORIZED,
      "Invalid credentials or access restricted.",
    );
  }

  const isValid = await bcrypt.compare(password, user[0].password);
  if (!isValid) {
    logger.warn(`Login failed: Invalid password for ${email}`);
    throw new APIError(UNAUTHORIZED, "Invalid credentials");
  }

  const token = jwt.sign(
    { userId: user[0].id, email: user[0].email, role: user[0].role },
    JWT_SECRET,
    { expiresIn: "24h" },
  );

  logger.info(`Login successful: ${email}`);

  res
    .status(OK)
    .json(
      new APIResponse(
        OK,
        {
          token,
          user: { id: user[0].id, email: user[0].email, role: user[0].role },
        },
        "Login successful",
      ),
    );
});

export const adminLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await db
    .select()
    .from(users)
    .where(and(eq(users.email, email), eq(users.role, "ADMIN")))
    .limit(1);

  if (user.length === 0) {
    logger.warn(`Admin login failed: Access denied for ${email}`);
    throw new APIError(FORBIDDEN, "Access denied: Administrators only");
  }

  const isValid = await bcrypt.compare(password, user[0].password);
  if (!isValid) {
    logger.warn(`Admin login failed: Invalid password for ${email}`);
    throw new APIError(UNAUTHORIZED, "Invalid credentials");
  }

  const token = jwt.sign(
    { userId: user[0].id, email: user[0].email, role: user[0].role },
    JWT_SECRET,
    { expiresIn: "24h" },
  );

  logger.info(`Admin login successful: ${email}`);

  res
    .status(OK)
    .json(
      new APIResponse(
        OK,
        {
          token,
          user: { id: user[0].id, email: user[0].email, role: user[0].role },
        },
        "Admin login successful",
      ),
    );
});
