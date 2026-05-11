import { and, desc, eq } from "drizzle-orm";

import { generatedVideoTable, projectTable } from "@/db/schema";
import { db } from "@/lib/index";
import { requireAuthenticatedUser } from "@/action/user.action";

type VideoStatus = "pending" | "processing" | "completed" | "failed";

type CreateGeneratedVideoInput = {
  projectId: number;
  url: string;
  status?: VideoStatus;
  duration: number;
  aspectRation: string;
  credits: number;
};

type UpdateGeneratedVideoInput = {
  url?: string;
  status?: VideoStatus;
  duration?: number;
  aspectRation?: string;
  credits?: number;
};

const generatedVideoColumns = {
  id: generatedVideoTable.id,
  projectId: generatedVideoTable.projectId,
  url: generatedVideoTable.url,
  status: generatedVideoTable.status,
  duration: generatedVideoTable.duration,
  aspectRation: generatedVideoTable.aspectRation,
  credits: generatedVideoTable.credits,
  createdAt: generatedVideoTable.createdAt,
  updatedAt: generatedVideoTable.updatedAt,
} as const;

async function ensureProjectOwnership(projectId: number, userId: number) {
  const project = await db
    .select()
    .from(projectTable)
    .where(and(eq(projectTable.id, projectId), eq(projectTable.userId, userId)))
    .limit(1);

  if (!project[0]) {
    throw new Error("Project not found.");
  }

  return project[0];
}

export async function createGeneratedVideo(input: CreateGeneratedVideoInput) {
  const user = await requireAuthenticatedUser();

  await ensureProjectOwnership(input.projectId, user.id);

  const created = await db
    .insert(generatedVideoTable)
    .values({
      projectId: input.projectId,
      url: input.url.trim(),
      status: input.status ?? "pending",
      duration: input.duration,
      aspectRation: input.aspectRation,
      credits: input.credits,
    })
    .returning();

  return created[0];
}

export async function listGeneratedVideos(projectId?: number) {
  const user = await requireAuthenticatedUser();

  if (projectId) {
    await ensureProjectOwnership(projectId, user.id);

    return await db
      .select(generatedVideoColumns)
      .from(generatedVideoTable)
      .where(eq(generatedVideoTable.projectId, projectId))
      .orderBy(desc(generatedVideoTable.createdAt));
  }

  const ownedProjects = await db
    .select({ id: projectTable.id })
    .from(projectTable)
    .where(eq(projectTable.userId, user.id));

  if (ownedProjects.length === 0) {
    return [];
  }

  const projectIds = new Set(ownedProjects.map((p) => p.id));
  const allVideos = await db
    .select(generatedVideoColumns)
    .from(generatedVideoTable)
    .orderBy(desc(generatedVideoTable.createdAt));

  return allVideos.filter((video) => projectIds.has(video.projectId));
}

export async function updateGeneratedVideo(
  videoId: number,
  input: UpdateGeneratedVideoInput
) {
  const user = await requireAuthenticatedUser();

  const videoRow = await db
    .select(generatedVideoColumns)
    .from(generatedVideoTable)
    .where(eq(generatedVideoTable.id, videoId))
    .limit(1);

  const video = videoRow[0];
  if (!video) {
    return null;
  }

  await ensureProjectOwnership(video.projectId, user.id);

  const patch: Partial<typeof generatedVideoTable.$inferInsert> = {};

  if (typeof input.url === "string") {
    const url = input.url.trim();
    if (!url) {
      throw new Error("URL cannot be empty.");
    }
    patch.url = url;
  }

  if (typeof input.status === "string") {
    patch.status = input.status;
  }

  if (typeof input.duration === "number") {
    patch.duration = input.duration;
  }

  if (typeof input.aspectRation === "string") {
    patch.aspectRation = input.aspectRation;
  }

  if (typeof input.credits === "number") {
    patch.credits = input.credits;
  }

  if (Object.keys(patch).length === 0) {
    return video;
  }

  const updated = await db
    .update(generatedVideoTable)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(generatedVideoTable.id, videoId))
    .returning();

  return updated[0] ?? null;
}
