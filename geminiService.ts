import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, UserInputs } from "./types";

/**
 * AI-First Content Health Audit
 * Server-side Gemini analysis with Google Search grounding
 */
export const analyzeWebsite = async (
  inputs: UserInputs
): Promise<AnalysisResult> => {
  // 🔐 Server-side environment variable (Vercel / Node)
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "INTERNAL_CONFIG_ERROR: GEMINI_API_KEY is missing in environment variables."
    );
  }

  // ✅ Initialize Gemini client
  const ai = new GoogleGenAI({ apiKey });

  // 🧠 System instruction (critical for reliability)
  const systemInstruction = `
You are a senior multi-agent AI content intelligence system.
You analyze websites objectively and strategically.
You MUST return ONLY a single valid JSON object.
Do not include markdown, explanations, or commentary outside JSON.
`;

  // 🔍 User prompt
  const userPrompt = `
Analyze the website content for: ${inputs.websiteUrl}

TASKS:
1. Identify the industry and business model.
2. Extract high-impact content (headings, CTAs) using Google Search grounding.
3. Evaluate content maturity across five dimensions:
   - Hygiene
   - Relevance
   - Sales Tool
   - Differentiation
   - Advanced Strategy

SCORING RULES:
- All scores must be numbers between 0 and 100.
- Be realistic and consistent.

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
      contents: [
        {
          role: "system",
          parts: [{ text: systemInstruction }]
        },
        {
          role: "user",
          parts: [{ text: userPrompt }]
        }
      ],
      config: {
        responseMimeType: "application/json",
        tools: [{ googleSearch: {} }]
      }
    });

    if (!response.text) {
      throw new Error("Empty response from Gemini.");
    }

    // ✅ Safe JSON parse (JSON-only mode enforced)
    const result = JSON.parse(response.text) as AnalysisResult;

    // 🧮 Clamp scores defensively
    const clamp = (n: number) => Math.max(0, Math.min(100, n));

    result.overallScore = clamp(result.overallScore);
    Object.values(result.categories).forEach((cat: any) => {
      cat.score = clamp(cat.score);
    });

    // 🌐 Extract Google Search grounding sources
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
    console.error("Gemini intelligence error:", error);
    throw new Error(
      error?.message || "Content analysis failed unexpectedly."
    );
  }
};
