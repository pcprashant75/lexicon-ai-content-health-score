import { AnalysisResult, UserInputs } from "./types";

/**
 * Client-side service
 * Calls the secure server API
 */
export const analyzeWebsite = async (
  inputs: UserInputs
): Promise<AnalysisResult> => {

  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      websiteUrl: inputs.websiteUrl
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Analysis failed");
  }

  return response.json();
};
