import { relations } from "drizzle-orm";
import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const projectStatusEnum = pgEnum("project_status", [
  "draft",
  "pending",
  "active",
  "archived",
]);

export const generateVideoStatusEnum = pgEnum("generate_video_status", [
  "pending",
  "processing",
  "completed",
  "failed",
]);

export const usersTable = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const projectTable = pgTable("projects", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  desc: text("desc").notNull(),
  status: projectStatusEnum("status").notNull().default("draft"),
  prompt: varchar("prompt", { length: 2000 }).notNull(),
  duration: integer("duration").notNull().default(5),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  aspectRatio: varchar("aspect_ratio", { length: 16 })
    .notNull()
    .default("16:9"),
  settings: jsonb("settings").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const generatedVideoTable = pgTable("generated_videos", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  projectId: integer("project_id")
    .notNull()
    .references(() => projectTable.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  status: generateVideoStatusEnum("status").notNull().default("pending"),
  progressStep: varchar("progress_step", { length: 64 }).notNull().default("queued"),
  progressMessage: text("progress_message"),
  generatedPrompt: text("generated_prompt"),
  themeConfig: jsonb("theme_config"),
  compositionCode: text("composition_code"),
  duration: integer("duration").notNull(),
  aspectRation: varchar("aspect_ration", { length: 32 }).notNull(),
  credits: integer("credits").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const usersRelations = relations(usersTable, ({ many }) => ({
  projects: many(projectTable),
}));

export const projectRelations = relations(projectTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [projectTable.userId],
    references: [usersTable.id],
  }),
  generatedVideos: many(generatedVideoTable),
}));

export const generatedVideoRelations = relations(
  generatedVideoTable,
  ({ one }) => ({
    project: one(projectTable, {
      fields: [generatedVideoTable.projectId],
      references: [projectTable.id],
    }),
  })
);