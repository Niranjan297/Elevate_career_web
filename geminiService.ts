
import { GoogleGenAI, Type } from "@google/genai";
import { AssessmentScores, CareerMatch } from "./types";

export async function generateCareerImage(prompt: string): Promise<string | null> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `A professional, futuristic, clean digital art concept showing: ${prompt}. Cinematic lighting, minimalist corporate aesthetic.` }],
      },
      // keep config empty to satisfy typings; model will use defaults for image generation
      config: {}
    });

    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    return null;
  }
}

export async function getQuickMarketPulse(sector: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: `Provide a 1-sentence ultra-fast market sentiment analysis for the ${sector} industry. Focus on growth potential.`,
    });
    return response.text || "Market stable with upward trajectory.";
  } catch (error) {
    return "Intelligence stream active.";
  }
}

export async function getCareerRecommendations(scores: AssessmentScores, topCareer: string): Promise<Partial<CareerMatch>> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    A student has completed a career assessment. 
    Interests: ${JSON.stringify(scores.interests)}
    Aptitudes: ${JSON.stringify(scores.aptitude)}
    Skills: ${scores.skills.map(s => `${s.name} (${s.level})`).join(', ')}
    Primary Suggested Career: ${topCareer}

    Provide professional career advice, strengths, gaps, and a detailed 4-step roadmap.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            gaps: { type: Type.ARRAY, items: { type: Type.STRING } },
            roadmap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phase: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  skills: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["phase", "title", "description", "skills"]
              }
            },
            resources: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  url: { type: Type.STRING },
                  type: { type: Type.STRING }
                },
                required: ["name", "url", "type"]
              }
            }
          },
          required: ["description", "strengths", "gaps", "roadmap", "resources"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      description: "Unable to generate AI insights at this moment.",
      strengths: ["Core Aptitude"],
      gaps: ["Technical Deep-dive"]
    };
  }
}

export async function searchGlobalMarketData(query: string): Promise<{text: string, sources: any[]}> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: query,
    config: { tools: [{ googleSearch: {} }] },
  });
  return {
    text: response.text || "",
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
}
