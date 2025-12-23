
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, UserInputs } from "./types";

/**
 * Audit website content using multi-agent AI logic powered by Gemini.
 * Uses Google Search grounding to extract high-impact content from the provided URL.
 */
export const analyzeWebsite = async (inputs: UserInputs): Promise<AnalysisResult> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("INTERNAL_CONFIG_ERROR: API_KEY is missing. Please add it to your environment variables (e.g., in Vercel Dashboard).");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Using gemini-3-flash-preview for maximum compatibility and quota availability
  const prompt = `
    Analyze the website content for: ${inputs.websiteUrl}

    You are a multi-agent AI content intelligence system. 
    TASK:
    1. Identify INDUSTRY and business model.
    2. Extract high-impact content (Headings, CTAs) using Google Search.
    3. Evaluate content across five dimensions: Hygiene, Relevance, Sales Tool, Differentiation, and Advanced Strategy.

    IMPORTANT: You MUST return the result as a single, valid JSON object. 
    Ensure all score values are numbers between 0 and 100.
    
    JSON STRUCTURE:
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
        tools: [{ googleSearch: {} }],
        // Avoid responseMimeType: "application/json" here as it can conflict with search grounding citations
      }
    });

    let rawText = response.text || '';
    
    // Robust extraction: models sometimes wrap JSON in markdown or add citations outside the JSON
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("The AI provided an invalid response format. Please try again.");
    }

    const result = JSON.parse(jsonMatch[0]) as AnalysisResult;
    
    // Extract grounding sources to satisfy guidelines
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
    throw new Error(error.message || "Unknown error occurred during analysis.");
  }
};
