import { NextResponse } from "next/server";

import {
  deleteProject,
  getProjectById,
  getProjectBySlug,
  updateProject,
} from "@/action/project.action";

function parseProjectId(value: string): number | null {
  const projectId = Number(value);
  if (!Number.isInteger(projectId) || projectId <= 0) {
    return null;
  }
  return projectId;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId: rawProjectId } = await params;
    const projectId = parseProjectId(rawProjectId);

    const project = projectId
      ? await getProjectById(projectId)
      : await getProjectBySlug(rawProjectId);
    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch project.";
    const status = message === "Unauthorized" ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const body = await req.json();
    const { projectId: rawProjectId } = await params;
    const projectId = parseProjectId(rawProjectId);

    let idToUpdate = projectId;
    if (idToUpdate === null) {
      const proj = await getProjectBySlug(rawProjectId);
      if (!proj) {
        return NextResponse.json({ error: "Project not found." }, { status: 404 });
      }
      idToUpdate = proj.id;
    }

    const project = await updateProject(idToUpdate as number, {
      title: body?.title,
      desc: body?.desc,
      prompt: body?.prompt,
      duration: typeof body?.duration === "number" ? body.duration : undefined,
      aspectRatio: body?.aspectRatio,
      settings: body?.settings,
      status: body?.status,
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update project.";
    const status = message === "Unauthorized" ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId: rawProjectId } = await params;
    const projectId = parseProjectId(rawProjectId);

    let idToDelete = projectId;
    if (idToDelete === null) {
      const proj = await getProjectBySlug(rawProjectId);
      if (!proj) {
        return NextResponse.json({ error: "Project not found." }, { status: 404 });
      }
      idToDelete = proj.id;
    }

    const deleted = await deleteProject(idToDelete as number);
    if (!deleted) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete project.";
    const status = message === "Unauthorized" ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
