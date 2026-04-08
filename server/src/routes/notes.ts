import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.js";
import {
  getAllActivityLogs,
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  manageCollaborators,
} from "../controllers/notes.js";

const router = Router();

router.get(
  "/activity/all",
  authenticateToken as any,
  getAllActivityLogs as any,
);

router.post("/", authenticateToken as any, createNote as any);

router.get("/", authenticateToken as any, getNotes as any);

router.get("/:noteUUID", getNoteById as any);

router.put("/:noteUUID", authenticateToken as any, updateNote as any);

router.delete("/:noteUUID", authenticateToken as any, deleteNote as any);

router.post(
  "/:noteUUID/collaborators",
  authenticateToken as any,
  manageCollaborators as any,
);

export default router;
