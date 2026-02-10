
import { GoogleGenAI, Type } from "@google/genai";
import { AssessmentScores, CareerMatch } from "./types";

// Always initialize GoogleGenAI inside the function to ensure the latest API key is used
// and follow the strict initialization pattern.

export async function generateCareerImage(prompt: string): Promise<string | null> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `A professional, futuristic, clean digital art concept showing: ${prompt}. Cinematic lighting, minimalist corporate aesthetic.` }],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    // Iterate through all parts to find the image part as per guidelines
    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    return null;
  }
}

export async function getCareerRecommendations(scores: AssessmentScores, topCareer: string): Promise<Partial<CareerMatch>> {
  // Ensure we use gemini-3-pro-preview for complex reasoning tasks
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  const prompt = `
    A student has completed a career assessment. 
    Interests: ${JSON.stringify(scores.interests)}
    Aptitudes: ${JSON.stringify(scores.aptitude)}
    Skills: ${scores.skills.map(s => `${s.name} (${s.level})`).join(', ')}
    Primary Suggested Career: ${topCareer}

    Provide professional career advice, strengths, gaps, and a detailed 4-step roadmap.
    Ensure each roadmap step has a 'phase' (e.g., 'Phase 1: Foundation'), a 'title', a 'description', and 'skills'.
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

    // Use .text property as per guidelines
    const jsonStr = response.text?.trim();
    return jsonStr ? JSON.parse(jsonStr) : {};
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      description: "Unable to generate AI insights at this moment.",
      strengths: ["Core Aptitude"],
      gaps: ["Technical Deep-dive"]
    };
  }
}
