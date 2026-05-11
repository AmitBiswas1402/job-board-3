export type GeneratedThemeConfig = {
  style: string;
  mood: string;
  colors: {
    background: string;
    primary: string;
    secondary: string;
    accent: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  motion: {
    pace: string;
    transitions: string;
    emphasis: string;
  };
  layout: {
    framing: string;
    density: string;
  };
};

export type ProjectGenerationRequest = {
  projectTitle: string;
  projectDescription: string;
  projectPrompt: string;
  duration: number;
  aspectRatio: string;
};

export type GeneratedProjectArtifacts = {
  aiPrompt: string;
  themeConfig: GeneratedThemeConfig;
  compositionCode: string;
};

export function extractJsonObject<T>(value: string): T {
  const trimmed = value.trim();
  const fenced = trimmed.match(/```json\s*([\s\S]*?)```/i);
  const rawJson = fenced?.[1] ?? trimmed;
  return JSON.parse(rawJson) as T;
}