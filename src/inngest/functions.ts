import { eq } from "drizzle-orm";

import { inngest, projectGenerationRequestedEvent } from "@/lib/inngest";
import { generateGeminiText } from "@/lib/gemini";
import {
  extractJsonObject,
  type GeneratedThemeConfig,
  type ProjectGenerationRequest,
} from "@/lib/project-generation";
import { db } from "@/lib/index";
import { generatedVideoTable, projectTable } from "@/db/schema";

type GenerationEvent = {
  data: {
    projectId: number;
    videoId: number;
  };
};

async function updateVideoProgress(
  videoId: number,
  values: Partial<typeof generatedVideoTable.$inferInsert>
) {
  await db
    .update(generatedVideoTable)
    .set({ ...values, updatedAt: new Date() })
    .where(eq(generatedVideoTable.id, videoId));
}

async function loadProjectGenerationRequest(projectId: number): Promise<ProjectGenerationRequest> {
  const projectRows = await db
    .select()
    .from(projectTable)
    .where(eq(projectTable.id, projectId))
    .limit(1);

  const project = projectRows[0];
  if (!project) {
    throw new Error("Project not found.");
  }

  return {
    projectTitle: project.title,
    projectDescription: project.desc,
    projectPrompt: project.prompt,
    duration: project.duration,
    aspectRatio: project.aspectRatio,
  };
}

function buildPromptRequest(input: ProjectGenerationRequest): string {
  return [
    "Write a concise but vivid prompt for an AI motion graphics video.",
    "Return only the prompt text with no markdown.",
    `Project title: ${input.projectTitle}`,
    `Project description: ${input.projectDescription}`,
    `User prompt: ${input.projectPrompt}`,
    `Duration: ${input.duration} seconds`,
    `Aspect ratio: ${input.aspectRatio}`,
  ].join("\n");
}

function buildThemeRequest(input: ProjectGenerationRequest, aiPrompt: string): string {
  return [
    "Create a JSON object for a Remotion motion graphics theme.",
    "Return only valid JSON and no markdown fences.",
    "Required keys: style, mood, colors, fonts, motion, layout.",
    "The colors object must include background, primary, secondary, accent, and text.",
    "The fonts object must include heading and body.",
    "The motion object must include pace, transitions, and emphasis.",
    "The layout object must include framing and density.",
    `Reference prompt: ${aiPrompt}`,
    `Original project prompt: ${input.projectPrompt}`,
  ].join("\n");
}

function buildRemotionRequest(
  input: ProjectGenerationRequest,
  aiPrompt: string,
  themeConfig: GeneratedThemeConfig
): string {
  return [
    "Write a detailed TypeScript Remotion composition for a motion graphics video.",
    "Return only code and no markdown fences.",
    "Include a default export composition, reusable constants, and a visually intentional layout.",
    "Use the provided theme configuration directly in the component.",
    "The code should be self-contained and ready to paste into a Remotion project.",
    `Project title: ${input.projectTitle}`,
    `Project prompt: ${input.projectPrompt}`,
    `AI prompt: ${aiPrompt}`,
    `Theme config: ${JSON.stringify(themeConfig)}`,
  ].join("\n");
}

export const generateRemotionVideo = inngest.createFunction(
  { id: "generate-remotion-video" },
  { event: projectGenerationRequestedEvent },
  async ({ event }) => {
    const { projectId, videoId } = (event as GenerationEvent).data;

    await updateVideoProgress(videoId, {
      status: "processing",
    });

    const request = await loadProjectGenerationRequest(projectId);

    await updateVideoProgress(videoId, {
        status: "processing",
    });

    const aiPrompt = await generateGeminiText(buildPromptRequest(request));

    await updateVideoProgress(videoId, {
        status: "processing",
    });

    const themeResponse = await generateGeminiText(buildThemeRequest(request, aiPrompt));
    const themeConfig = extractJsonObject<GeneratedThemeConfig>(themeResponse);

    await updateVideoProgress(videoId, {
        status: "processing",
    });

    const compositionCode = await generateGeminiText(
      buildRemotionRequest(request, aiPrompt, themeConfig)
    );

    await updateVideoProgress(videoId, {
      url: `/api/videos/${videoId}/artifact`,
      status: "completed",
    });

    await db
      .update(projectTable)
      .set({ status: "active", updatedAt: new Date() })
      .where(eq(projectTable.id, projectId));

    return { projectId, videoId };
  }
);