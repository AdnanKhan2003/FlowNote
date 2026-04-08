import { users } from "../db/schema.js";

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export interface TokenPayload {
  userId: string;
  email: string;
  role: "ADMIN" | "EDITOR" | "VIEWER";
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}
