import { GoogleGenAI, Type } from "@google/genai";

export async function getTutorResponse(question: string, context?: string) {
  const meta = import.meta as any;
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || meta.env?.API_KEY || meta.env?.GEMINI_API_KEY || (window as any).API_KEY || (window as any).GEMINI_API_KEY;

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: context ? `Context: ${context}\n\nQuestion: ${question}` : question,
    config: {
      systemInstruction: "You are an expert UTBK/SNBT tutor specializing in helping students get into Medical School (FK). You are clear, encouraging, and highly strategic. Keep your responses concise and focused, within 1000 tokens.",
    },
  });
  return response.text || "Sorry, I couldn't generate a response.";
}

export async function getPerformanceInsight(results: any[]) {
  const meta = import.meta as any;
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || meta.env?.API_KEY || meta.env?.GEMINI_API_KEY || (window as any).API_KEY || (window as any).GEMINI_API_KEY;

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze these test results and provide insights: ${JSON.stringify(results)}`,
    config: {
      systemInstruction: "You are an expert UTBK/SNBT tutor. Provide concise insights based on the test results, within 1000 tokens.",
    },
  });
  return response.text || "Sorry, I couldn't generate insights.";
}

export async function generateStudyPlan(targetFK: string, currentScore: number, weakTopics: string[]) {
  const meta = import.meta as any;
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || meta.env?.API_KEY || meta.env?.GEMINI_API_KEY || (window as any).API_KEY || (window as any).GEMINI_API_KEY;

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Create a study plan to reach target score ${targetFK} from ${currentScore}. Weak topics: ${weakTopics.join(', ')}`,
    config: {
      systemInstruction: "You are an expert UTBK/SNBT tutor. Create a concise study plan, within 1000 tokens.",
    },
  });
  return JSON.parse(response.text);
}
