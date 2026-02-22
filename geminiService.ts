import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. We grab the secure key from your .env file
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export const searchGlobalMarketData = async (query: string) => {
  try {
    if (!apiKey || apiKey === 'undefined' || apiKey.includes('your_gemini_api_key')) {
      console.warn("Gemini API Key is missing. Using mock response.");
      return {
        text: `VERDICT: Strong future growth predicted for "${query}".\n\nGROWTH DRIVERS: Digital transformation and increasing demand for specialized expertise.\n\nAI RISK: Low to Medium. Human-in-the-loop oversight remains critical.\n\nSALARY OUTLOOK: competitive across both global and regional markets.`,
        sources: []
      };
    }

    // 2. We use Gemini 1.5 Flash (Super fast and great for text)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // 3. Prompt Engineering: We force the AI to answer in a specific, structured way
    const prompt = `
      You are an elite career and market analyst.
      Analyze the future market for this career/query: "${query}".
      
      Provide a highly professional, structured response. 
      Format it clearly with blank lines between each section so it is easy to read.
      
      Include these specific sections:
      VERDICT: A 1-2 sentence harsh but honest market verdict.
      
      GROWTH DRIVERS: What is pushing this career forward?
      
      AI RISK: Is this job safe from AI automation? (Low/Medium/High) and exactly why.
      
      SALARY OUTLOOK: General salary expectations (Global and India context).
    `;

    // 4. Fetch the data
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return {
      text: text,
      sources: []
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      text: "ERROR: I dont have API key so you may get choose some other options :)",
      sources: []
    };
  }
};

// Keep this as a backup helper function
export const getQuickMarketPulse = async (topic: string) => {
  return "Market analysis active. Standing by.";
};