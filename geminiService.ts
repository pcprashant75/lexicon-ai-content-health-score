
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, UserInputs } from "./types";

/**
 * Audit website content using multi-agent AI logic powered by Gemini.
 * This service runs client-side and uses the injected API_KEY.
 */
export const analyzeWebsite = async (inputs: UserInputs): Promise<AnalysisResult> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("INTERNAL_CONFIG_ERROR: API_KEY is missing. Please ensure it is set in your environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // System instruction for the model
  const systemInstruction = `
    You are a senior multi-agent AI content intelligence system.
    You must be objective, strategic, and analytical.
    You MUST return ONLY a single valid JSON object.
    Do NOT include markdown, explanations, or commentary outside JSON.
  `;

  // Combined prompt with industry detection and search grounding tasks
  const userPrompt = `
    Analyze the website content for: ${inputs.websiteUrl}

    TASKS:
    1. Identify the INDUSTRY and business model.
    2. Extract high-impact content such as key headings, value propositions, and CTAs using Google Search grounding.
    3. Evaluate content maturity across five dimensions: Hygiene, Relevance, Sales Tool, Differentiation, and Advanced Strategy.

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
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json"
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("The AI returned an empty response. Please try again.");
    }

    // Safely parse the JSON result
    const result = JSON.parse(responseText) as AnalysisResult;

    // Defensive score clamping (0-100)
    const clamp = (n: number) => Math.max(0, Math.min(100, n));
    result.overallScore = clamp(result.overallScore);
    
    if (result.categories) {
      Object.values(result.categories).forEach((cat: any) => {
        if (cat.score !== undefined) cat.score = clamp(cat.score);
      });
    }

    // Extract grounding sources from search
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
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
    throw new Error(error.message || "Content analysis failed. Please check the console for details.");
  }
};
