import { GoogleGenAI } from "@google/genai";
import { AnalysisResult } from "../types";

export default async function handler(req: Request) {
  // Allow only POST
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405 }
    );
  }

  // Parse request body
  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON body" }),
      { status: 400 }
    );
  }

  const { websiteUrl } = body;

  if (!websiteUrl || typeof websiteUrl !== "string") {
    return new Response(
      JSON.stringify({ error: "websiteUrl is required" }),
      { status: 400 }
    );
  }

  // Read API key (SERVER ONLY)
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "GEMINI_API_KEY missing" }),
      { status: 500 }
    );
  }

  // Initialize Gemini
  const ai = new GoogleGenAI({ apiKey });

  // System instruction (strict)
  const systemInstruction = `
You are a senior multi-agent AI content intelligence system.
You must be objective, strategic, and analytical.
You MUST return ONLY a single valid JSON object.
Do NOT include markdown, explanations, or commentary outside JSON.
`;

  // User prompt (FULL – no placeholders)
  const userPrompt = `
Analyze the website content for: ${websiteUrl}

TASKS:
1. Identify the INDUSTRY and business model.
2. Extract high-impact content such as key headings, value propositions, and CTAs using Google Search grounding.
3. Evaluate content maturity across five dimensions:
   - Hygiene
   - Relevance
   - Sales Tool
   - Differentiation
   - Advanced Strategy

SCORING RULES:
- All scores must be numbers between 0 and 100.
- Be realistic and consistent across categories.

EXPECTED JSON STRUCTURE:
{
  "overallScore": number,
  "maturityLevel": "Foundational" | "Growth-stage" | "Strategic" | "Market leader",
  "industry": string,
  "executiveSummary": string,
  "categories": {
    "hygiene": {
      "name": "Hygiene",
      "score": number,
      "insight": string,
      "reasoning": string
    },
    "relevance": {
      "name": "Relevance",
      "score": number,
      "insight": string,
      "reasoning": string
    },
    "salesTool": {
      "name": "Sales Tool",
      "score": number,
      "insight": string,
      "reasoning": string
    },
    "differentiation": {
      "name": "Differentiation",
      "score": number,
      "insight": string,
      "reasoning": string
    },
    "advancedStrategy": {
      "name": "Advanced Strategy",
      "score": number,
      "insight": string,
      "reasoning": string
    }
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
      throw new Error("Empty response from Gemini");
    }

    // Parse JSON safely
    const result = JSON.parse(response.text) as AnalysisResult;

    // Defensive score clamping
    const clamp = (n: number) => Math.max(0, Math.min(100, n));
    result.overallScore = clamp(result.overallScore);

    Object.values(result.categories).forEach((cat: any) => {
      cat.score = clamp(cat.score);
    });

    // Extract Google Search grounding sources (if available)
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

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err: any) {
    console.error("Gemini analyze error:", err);

    return new Response(
      JSON.stringify({
        error: err?.message || "Content analysis failed"
      }),
      { status: 500 }
    );
  }
}
