import { GoogleGenerativeAI } from "@google/generative-ai";

const DEFAULT_GEMINI_MODEL = "gemini-1.5-flash";

function getGeminiApiKey(): string {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is required.");
  }
  return apiKey;
}

function getGeminiModelName(): string {
  return process.env.GEMINI_MODEL ?? DEFAULT_GEMINI_MODEL;
}

export async function generateGeminiText(prompt: string): Promise<string> {
  const client = new GoogleGenerativeAI(getGeminiApiKey());
  const model = client.getGenerativeModel({ model: getGeminiModelName() });
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}