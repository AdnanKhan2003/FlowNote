import { NextFunction, Request, Response } from "express";
import { db } from "../db/index.js";
import { notes, collaborators, activityLogs, users } from "../db/schema.js";
import { eq, and, or, desc } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../lib/asyncHandler.js";
import APIResponse from "../lib/APIResponse.js";
import APIError from "../lib/APIError.js";
import {
  OK,
  CREATED,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
} from "../constants/http.js";
import { JWT_SECRET } from "../constants/env.js";
import logger from "../lib/logger.js";

interface AuthRequest extends Request {
  user?: { userId: string; email: string; role: "ADMIN" | "EDITOR" | "VIEWER" };
}

export const getAllActivityLogs = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;

    const logs = await db
      .select({
        id: activityLogs.id,
        action: activityLogs.action,
        timestamp: activityLogs.timestamp,
        noteTitle: notes.title,
        userEmail: users.email,
      })
      .from(activityLogs)
      .leftJoin(notes, eq(activityLogs.noteId, notes.id))
      .leftJoin(users, eq(activityLogs.userId, users.id))
      .where(or(eq(activityLogs.userId, userId), eq(notes.ownerId, userId)))
      .orderBy(desc(activityLogs.timestamp))
      .limit(50);

    logger.info(`Activity logs fetched for user: ${userId}`);

    res
      .status(OK)
      .json(new APIResponse(OK, logs || [], "Activity logs fetched"));
  },
);

export const createNote = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { title, content } = req.body;
    const userId = req.user!.userId;

    const newNote = await db
      .insert(notes)
      .values({
        title: title || "",
        content: content || "",
        ownerId: userId,
      })
      .returning();

    await db.insert(activityLogs).values({
      userId,
      noteId: newNote[0].id,
      action: "CREATE",
    });

    logger.info(`Note created: ${newNote[0].id} by user: ${userId}`);

    res
      .status(CREATED)
      .json(new APIResponse(CREATED, newNote[0], "Note created"));
  },
);

export const getNotes = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;

    const results = await db
      .select({
        id: notes.id,
        title: notes.title,
        content: notes.content,
        ownerId: notes.ownerId,
        isPublic: notes.isPublic,
        createdAt: notes.createdAt,
        updatedAt: notes.updatedAt,
      })
      .from(notes)
      .leftJoin(collaborators, eq(notes.id, collaborators.noteId))
      .where(or(eq(notes.ownerId, userId), eq(collaborators.userId, userId)));

    const uniqueNotes = Array.from(
      new Map(results.map((n) => [n.id, n])).values(),
    );

    logger.info(`Notes fetched for user: ${userId}`);
    res.status(OK).json(new APIResponse(OK, uniqueNotes, "Notes fetched"));
  },
);

export const getNoteById = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const rawId = req.params.noteUUID;

    if (!rawId || rawId === "activity") return next();

    const targetNoteId = String(rawId);

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    let userId: string | null = null;
    if (token) {
      try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        userId = String(decoded.userId);
      } catch (err) {}
    }

    const noteData = await db
      .select()
      .from(notes)
      .where(eq(notes.id, targetNoteId))
      .limit(1);

    if (noteData.length === 0) {
      throw new APIError(NOT_FOUND, "Note not found");
    }

    const currentNote = noteData[0];
    let currentUserPermission = "VIEWER";

    if (userId) {
      if (currentNote.ownerId === userId) {
        currentUserPermission = "OWNER";
      } else {
        const collabInfo = await db
          .select()
          .from(collaborators)
          .where(
            and(
              eq(collaborators.noteId, targetNoteId),
              eq(collaborators.userId, userId),
            ),
          )
          .limit(1);

        if (collabInfo.length > 0) {
          currentUserPermission = collabInfo[0].permission;
        } else if (!currentNote.isPublic) {
          logger.warn(`Unauthorized access attempt to note ${targetNoteId} by user ${userId || "Anonymous"}`);
          throw new APIError(FORBIDDEN, "Access denied");
        }
      }
    } else if (!currentNote.isPublic) {
      logger.warn(`Unauthorized access attempt to note ${targetNoteId} by anonymous user`);
      throw new APIError(UNAUTHORIZED, "Authentication required");
    }

    logger.info(`Note ${targetNoteId} fetched by user ${userId || "Anonymous"}`);

    res
      .status(OK)
      .json(
        new APIResponse(
          OK,
          { ...currentNote, currentUserPermission },
          "Note fetched",
        ),
      );
  },
);

export const updateNote = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const targetNoteId = String(req.params.noteUUID);
    const { title, content, isPublic } = req.body;
    const userId = req.user!.userId;

    const existing = await db
      .select()
      .from(notes)
      .where(eq(notes.id, targetNoteId))
      .limit(1);
    if (existing.length === 0) {
      logger.warn(`Update failed: Note ${targetNoteId} not found`);
      throw new APIError(NOT_FOUND, "Note not found");
    }

    const collab = await db
      .select()
      .from(collaborators)
      .where(
        and(
          eq(collaborators.noteId, targetNoteId),
          eq(collaborators.userId, userId),
        ),
      )
      .limit(1);

    const hasPermission =
      existing[0].ownerId === userId ||
      (collab.length > 0 && collab[0].permission === "EDITOR");
    if (!hasPermission) {
      logger.warn(`Update failed: Permission denied for user ${userId} on note ${targetNoteId}`);
      throw new APIError(FORBIDDEN, "Permission denied");
    }

    const updated = await db
      .update(notes)
      .set({
        title: title ?? existing[0].title,
        content: content ?? existing[0].content,
        isPublic: isPublic ?? existing[0].isPublic,
        updatedAt: new Date(),
      })
      .where(eq(notes.id, targetNoteId))
      .returning();

    await db.insert(activityLogs).values({
      userId,
      noteId: targetNoteId,
      action: "UPDATE",
    });

    logger.info(`Note updated: ${targetNoteId} by user: ${userId}`);

    res.status(OK).json(new APIResponse(OK, updated[0], "Note updated"));
  },
);

export const deleteNote = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const targetNoteId = String(req.params.noteUUID);
    const userId = req.user!.userId;

    const existing = await db
      .select()
      .from(notes)
      .where(eq(notes.id, targetNoteId))
      .limit(1);
    if (existing.length === 0) throw new APIError(NOT_FOUND, "Note not found");

    if (existing[0].ownerId !== userId) {
      logger.warn(`Delete failed: User ${userId} is not the owner of note ${targetNoteId}`);
      throw new APIError(FORBIDDEN, "Only owners can delete");
    }

    await db
      .delete(collaborators)
      .where(eq(collaborators.noteId, targetNoteId));
    await db.delete(activityLogs).where(eq(activityLogs.noteId, targetNoteId));
    await db.delete(notes).where(eq(notes.id, targetNoteId));

    logger.info(`Note deleted: ${targetNoteId} by user: ${userId}`);

    res.status(OK).json(new APIResponse(OK, null, "Note deleted successfully"));
  },
);

export const manageCollaborators = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const targetNoteId = String(req.params.noteUUID);
    const { email, permission } = req.body;
    const userId = req.user!.userId;

    const noteData = await db
      .select()
      .from(notes)
      .where(eq(notes.id, targetNoteId))
      .limit(1);
    if (!noteData[0] || noteData[0].ownerId !== userId) {
      logger.warn(`Share failed: User ${userId} is not the owner of note ${targetNoteId}`);
      throw new APIError(FORBIDDEN, "Only owners can share");
    }

    const targetUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (!targetUser[0]) throw new APIError(NOT_FOUND, "User not found");

    await db
      .insert(collaborators)
      .values({
        noteId: targetNoteId,
        userId: targetUser[0].id,
        permission,
      })
      .onConflictDoUpdate({
        target: [collaborators.noteId, collaborators.userId],
        set: { permission },
      });

    await db.insert(activityLogs).values({
      userId,
      noteId: targetNoteId,
      action: `SHARE_${permission}`,
    });

    logger.info(`Note ${targetNoteId} shared with ${email} (${permission}) by user: ${userId}`);

    res
      .status(OK)
      .json(new APIResponse(OK, null, "Collaborator added/updated"));
  },
);
