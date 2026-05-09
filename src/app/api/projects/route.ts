import { NextResponse } from "next/server";

import { createProject, listMyProjects } from "@/action/project.action";

export async function GET() {
  try {
    const projects = await listMyProjects();
    return NextResponse.json({ projects });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load projects.";
    const status = message === "Unauthorized" ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const project = await createProject({
      title: body?.title ?? "",
      desc: body?.desc ?? "",
      prompt: body?.prompt ?? "",
      duration: Number(body?.duration ?? 5),
      aspectRatio: body?.aspectRatio ?? "16:9",
      settings: body?.settings ?? { duration: Number(body?.duration ?? 5), aspectRatio: body?.aspectRatio ?? "16:9" },
      status: body?.status,
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create project.";
    const status = message === "Unauthorized" ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
