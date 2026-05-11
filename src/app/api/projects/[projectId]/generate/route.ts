import { NextResponse } from "next/server";

import { createGeneratedVideo, listGeneratedVideos } from "@/action/video.action";
import { getProjectById, updateProject } from "@/action/project.action";
import { inngest, projectGenerationRequestedEvent } from "@/lib/inngest";

function isActiveGeneration(status: string): boolean {
  return status === "pending" || status === "processing";
}

function parseProjectId(value: string): number {
  const projectId = Number(value);
  if (!Number.isInteger(projectId) || projectId <= 0) {
    throw new Error("Invalid project id.");
  }
  return projectId;
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId: rawProjectId } = await params;
    const projectId = parseProjectId(rawProjectId);

    const project = await getProjectById(projectId);
    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    const videos = await listGeneratedVideos(projectId);
    const activeVideo = videos.find((video) => isActiveGeneration(video.status));

    if (activeVideo) {
      if (project.status !== "pending") {
        await updateProject(projectId, { status: "pending" });
      }

      return NextResponse.json({ project, video: activeVideo, queued: false });
    }

    const queuedProject =
      project.status === "pending"
        ? project
        : await updateProject(projectId, { status: "pending" });

    const video = await createGeneratedVideo({
      projectId,
      url: "",
      status: "pending",
      duration: queuedProject?.duration ?? project.duration,
      aspectRation: queuedProject?.aspectRatio ?? project.aspectRatio,
      credits: 0,
    });

    await inngest.send({
      name: projectGenerationRequestedEvent,
      data: {
        projectId,
        videoId: video.id,
      },
    });

    return NextResponse.json({ project: queuedProject, video, queued: true }, { status: 202 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to queue generation.";
    const status = message === "Unauthorized" ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}