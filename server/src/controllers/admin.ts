import { Request, Response } from "express";
import { db } from "../db/index.js";
import { users, activityLogs, notes } from "../db/schema.js";
import { eq, desc } from "drizzle-orm";
import { asyncHandler } from "../lib/asyncHandler.js";
import APIResponse from "../lib/APIResponse.js";
import { OK } from "../constants/http.js";
import logger from "../lib/logger.js";

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Admin ${req.user?.email} fetching all users`);

  const allUsers = await db
    .select({
      id: users.id,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt));

  res
    .status(OK)
    .json(new APIResponse(OK, allUsers, "All users fetched successfully"));
});

export const getGlobalActivity = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info(`Admin ${req.user?.email} fetching global activity logs`);

    const logs = await db
      .select({
        id: activityLogs.id,
        action: activityLogs.action,
        timestamp: activityLogs.timestamp,
        userEmail: users.email,
        noteTitle: notes.title,
      })
      .from(activityLogs)
      .leftJoin(users, eq(activityLogs.userId, users.id))
      .leftJoin(notes, eq(activityLogs.noteId, notes.id))
      .orderBy(desc(activityLogs.timestamp))
      .limit(100);

    res
      .status(OK)
      .json(new APIResponse(OK, logs, "Global activity logs fetched"));
  },
);
