import { NextResponse } from "next/server";

import { createGeneratedVideo, listGeneratedVideos } from "@/action/video.action";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rawProjectId = searchParams.get("projectId");

    const projectId = rawProjectId ? Number(rawProjectId) : undefined;
    if (rawProjectId && (!Number.isInteger(projectId) || Number(projectId) <= 0)) {
      return NextResponse.json({ error: "Invalid project id." }, { status: 400 });
    }

    const videos = await listGeneratedVideos(projectId);
    return NextResponse.json({ videos });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to list videos.";
    const status = message === "Unauthorized" ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const video = await createGeneratedVideo({
      projectId: Number(body?.projectId),
      url: body?.url ?? "",
      status: body?.status,
      duration: Number(body?.duration),
      aspectRation: body?.aspectRation ?? "",
      credits: Number(body?.credits),
    });

    return NextResponse.json({ video }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create video.";
    const status = message === "Unauthorized" ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
