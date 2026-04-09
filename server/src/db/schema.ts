import { eq, sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["ADMIN", "EDITOR", "VIEWER"]);
export const permissionEnum = pgEnum("permission", ["EDITOR", "VIEWER"]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").unique().notNull(),
    password: text("password").notNull(),
    role: userRoleEnum("role").default("VIEWER").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    adminRoleIdx: uniqueIndex("admin_role_idx").on(table.role).where(sql`role = 'ADMIN'`),
  })
);

export const notes = pgTable("notes", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  ownerId: uuid("owner_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  isPublic: boolean("is_public").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const collaborators = pgTable(
  "collaborators",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    noteId: uuid("note_id")
      .references(() => notes.id, { onDelete: "cascade" })
      .notNull(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    permission: permissionEnum("permission").notNull(),
  },
  (table) => ({
    noteUserIdx: uniqueIndex("note_user_idx").on(table.noteId, table.userId),
  }),
);

export const activityLogs = pgTable("activity_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  noteId: uuid("note_id").references(() => notes.id, { onDelete: "cascade" }),
  action: text("action").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});
