import { and, desc, eq } from "drizzle-orm";
import { randomUUID } from "crypto";

import { projectTable } from "@/db/schema";
import { db } from "@/lib/index";
import { requireAuthenticatedUser } from "@/action/user.action";

type ProjectStatus = "draft" | "pending" | "active" | "archived";

type ProjectInput = {
  title: string;
  desc: string;
  prompt: string;
  duration: number;
  aspectRatio: string;
  settings: Record<string, unknown>;
  status?: ProjectStatus;
};

type ProjectUpdateInput = Partial<ProjectInput>;

export async function createProject(input: ProjectInput) {
  const user = await requireAuthenticatedUser();

  const title = input.title.trim();
  const desc = input.desc.trim();
  const prompt = input.prompt.trim();

  if (!title || !desc || !prompt) {
    throw new Error("Title, desc and prompt are required.");
  }

  if (prompt.length > 2000) {
    throw new Error("Prompt must be 2000 characters or less.");
  }

  if (!Number.isInteger(input.duration) || input.duration <= 0) {
    throw new Error("Duration must be a positive integer.");
  }

  const aspectRatio = input.aspectRatio.trim();
  if (!aspectRatio) {
    throw new Error("Aspect ratio is required.");
  }

  if (typeof input.settings !== "object" || input.settings === null) {
    throw new Error("Settings must be a valid JSON object.");
  }

  const slug = randomUUID();

  const created = await db
    .insert(projectTable)
    .values({
      userId: user.id,
      title,
      desc,
      prompt,
      slug,
      duration: input.duration,
      aspectRatio,
      settings: input.settings,
      status: input.status ?? "draft",
    })
    .returning();

  return created[0];
}

export async function getProjectBySlug(slug: string) {
  const user = await requireAuthenticatedUser();

  const rows = await db
    .select()
    .from(projectTable)
    .where(and(eq(projectTable.slug, slug), eq(projectTable.userId, user.id)))
    .limit(1);

  return rows[0] ?? null;
}

export async function listMyProjects() {
  const user = await requireAuthenticatedUser();

  return await db
    .select()
    .from(projectTable)
    .where(eq(projectTable.userId, user.id))
    .orderBy(desc(projectTable.createdAt));
}

export async function getProjectById(projectId: number) {
  const user = await requireAuthenticatedUser();

  const rows = await db
    .select()
    .from(projectTable)
    .where(and(eq(projectTable.id, projectId), eq(projectTable.userId, user.id)))
    .limit(1);

  return rows[0] ?? null;
}

export async function updateProject(projectId: number, input: ProjectUpdateInput) {
  const user = await requireAuthenticatedUser();

  const patch: Partial<typeof projectTable.$inferInsert> = {};

  if (typeof input.title === "string") {
    const title = input.title.trim();
    if (!title) {
      throw new Error("Title cannot be empty.");
    }
    patch.title = title;
  }

  if (typeof input.desc === "string") {
    const desc = input.desc.trim();
    if (!desc) {
      throw new Error("Description cannot be empty.");
    }
    patch.desc = desc;
  }

  if (typeof input.prompt === "string") {
    const prompt = input.prompt.trim();
    if (!prompt) {
      throw new Error("Prompt cannot be empty.");
    }
    if (prompt.length > 2000) {
      throw new Error("Prompt must be 2000 characters or less.");
    }
    patch.prompt = prompt;
  }

  if (typeof input.duration === "number") {
    if (!Number.isInteger(input.duration) || input.duration <= 0) {
      throw new Error("Duration must be a positive integer.");
    }
    patch.duration = input.duration;
  }

  if (typeof input.aspectRatio === "string") {
    const aspectRatio = input.aspectRatio.trim();
    if (!aspectRatio) {
      throw new Error("Aspect ratio cannot be empty.");
    }
    patch.aspectRatio = aspectRatio;
  }

  if (typeof input.status === "string") {
    patch.status = input.status;
  }

  if (typeof input.settings === "object" && input.settings !== null) {
    patch.settings = input.settings;
  }

  if (Object.keys(patch).length === 0) {
    return await getProjectById(projectId);
  }

  const updated = await db
    .update(projectTable)
    .set({ ...patch, updatedAt: new Date() })
    .where(and(eq(projectTable.id, projectId), eq(projectTable.userId, user.id)))
    .returning();

  return updated[0] ?? null;
}

export async function deleteProject(projectId: number) {
  const user = await requireAuthenticatedUser();

  const deleted = await db
    .delete(projectTable)
    .where(and(eq(projectTable.id, projectId), eq(projectTable.userId, user.id)))
    .returning({ id: projectTable.id });

  return deleted.length > 0;
}
