import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

import { db } from "@/lib/index";
import { projectTable, generatedVideoTable } from "@/db/schema";

// Dev-only route to quickly create a sample project + generated video.
// NOTE: This bypasses auth and must NEVER be enabled in production.
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not allowed in production" }, { status: 403 });
  }

  try {
    const slug = randomUUID();
    const now = new Date();

    const [project] = await db.insert(projectTable).values({
      userId: 1,
      title: "Sample: Flying Car",
      desc: "Quick sample project created for UI testing",
      prompt: "A futuristic flying car soaring through neon-lit city streets at dusk.",
      slug,
      duration: 10,
      aspectRatio: "16:9",
      settings: { quality: "medium" },
      status: "draft",
      createdAt: now,
      updatedAt: now,
    }).returning();

    const [video] = await db.insert(generatedVideoTable).values({
      projectId: project.id,
      url: "",
      status: "pending",
      duration: 10,
      aspectRation: "16:9",
      credits: 0,
      createdAt: now,
      updatedAt: now,
    }).returning();

    return NextResponse.json({ slug: project.slug, project, video });
  } catch (err: any) {
    const message = err?.message ?? "Failed to create sample";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
