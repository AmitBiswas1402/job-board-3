import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { requireAuthenticatedUser } from "@/action/user.action";
import { generatedVideoTable, projectTable } from "@/db/schema";
import { db } from "@/lib/index";

const videoColumns = {
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

function parseVideoId(value: string): number {
  const videoId = Number(value);
  if (!Number.isInteger(videoId) || videoId <= 0) {
    throw new Error("Invalid video id.");
  }
  return videoId;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    await requireAuthenticatedUser();

    const { videoId: rawVideoId } = await params;
    const videoId = parseVideoId(rawVideoId);

    const rows = await db
      .select({
        video: videoColumns,
        project: projectTable,
      })
      .from(generatedVideoTable)
      .innerJoin(projectTable, eq(generatedVideoTable.projectId, projectTable.id))
      .where(and(eq(generatedVideoTable.id, videoId)))
      .limit(1);

    const record = rows[0];
    if (!record) {
      return NextResponse.json({ error: "Video not found." }, { status: 404 });
    }

    return NextResponse.json({
      video: record.video,
      project: record.project,
      compositionCode: null,
      generatedPrompt: null,
      themeConfig: null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load artifact.";
    const status = message === "Unauthorized" ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}