import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { websiteUrl } = req.body;

  if (!websiteUrl) {
    return res.status(400).json({ error: "Website URL required" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Gemini API key missing" });
  }

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the website: ${websiteUrl} and return valid JSON.`,
  });

  const text = response.text || "";
  const json = text.match(/\{[\s\S]*\}/);

  if (!json) {
    return res.status(500).json({ error: "Invalid AI response" });
  }

  res.status(200).json(JSON.parse(json[0]));
}
