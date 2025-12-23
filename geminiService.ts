import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, UserInputs } from "./types";

/**
 * Audit website content using multi-agent AI logic powered by Gemini.
 * Uses Google Search grounding to extract high-impact content from the provided URL.
 */
export const analyzeWebsite = async (
  inputs: UserInputs
): Promise<AnalysisResult> => {

  // ✅ Vite-compatible environment variable
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

  if (!apiKey) {
    throw new Error(
      "INTERNAL_CONFIG_ERROR: VITE_GEMINI_API_KEY is missing. Please add it in the Vercel Environment Variables."
    );
  }

  // ✅ Correct Gemini client initialization
  const ai = new GoogleGenAI({ apiKey });

  // 🔍 Multi-agent analysis prompt
  const prompt = `
Analyze the website content for: ${inputs.websiteUrl}

You are a multi-agent AI content intelligence system.

TASKS:
1. Identify the INDUSTRY and business model.
2. Extract high-impact content (Headings, CTAs) using Google Search.
3. Evaluate content maturity across five dimensions:
   - Hygiene
   - Relevance
   - Sales Tool
   - Differentiation
   - Advanced Strategy

IMPORTANT:
- You MUST return a single, valid JSON object.
- All score values must be numbers between 0 and 100.
- Do NOT include markdown or commentary outside the JSON.

EXPECTED JSON STRUCTURE:
{
  "overallScore": number,
  "maturityLevel": "Foundational" | "Growth-stage" | "Strategic" | "Market leader",
  "industry": string,
  "executiveSummary": string,
  "categories": {
    "hygiene": { "name": "Hygiene", "score": number, "insight": string, "reasoning": string },
    "relevance": { "name": "Relevance", "score": number, "insight": string, "reasoning": string },
    "salesTool": { "name": "Sales Tool", "score": number, "insight": string, "reasoning": string },
    "differentiation": { "name": "Differentiation", "score": number, "insight": string, "reasoning": string },
    "advancedStrategy": { "name": "Advanced Strategy", "score": number, "insight": string, "reasoning": string }
  },
  "strengths": string[],
  "gaps": string[],
  "priorityActions": string[],
  "industryContext": {
    "buyerPersonas": string,
    "decisionMakers": string,
    "salesCycle": string
  }
}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const rawText = response.text ?? "";

    // 🧠 Robust JSON extraction (handles citations / markdown noise)
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("The AI returned an invalid response format.");
    }

    const result = JSON.parse(jsonMatch[0]) as AnalysisResult;

    // 🌐 Extract grounding sources (Google Search citations)
    const groundingChunks =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks;

    if (groundingChunks) {
      result.groundingSources = groundingChunks
        .filter((chunk: any) => chunk.web)
        .map((chunk: any) => ({
          title: chunk.web.title,
          uri: chunk.web.uri
        }));
    }

    return result;

  } catch (error: any) {
    console.error("Intelligence engine error:", error);
    throw new Error(
      error?.message || "Unknown error occurred during content analysis."
    );
  }
};
