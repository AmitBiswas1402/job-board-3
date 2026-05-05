import { NextResponse } from "next/server";

import { updateGeneratedVideo } from "@/action/video.action";

function parseVideoId(value: string): number {
  const videoId = Number(value);
  if (!Number.isInteger(videoId) || videoId <= 0) {
    throw new Error("Invalid video id.");
  }
  return videoId;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const body = await req.json();
    const { videoId: rawVideoId } = await params;
    const videoId = parseVideoId(rawVideoId);

    const video = await updateGeneratedVideo(videoId, {
      url: body?.url,
      status: body?.status,
      duration: typeof body?.duration === "number" ? body.duration : undefined,
      aspectRation: body?.aspectRation,
      credits: typeof body?.credits === "number" ? body.credits : undefined,
    });

    if (!video) {
      return NextResponse.json({ error: "Video not found." }, { status: 404 });
    }

    return NextResponse.json({ video });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update video.";
    const status = message === "Unauthorized" ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
