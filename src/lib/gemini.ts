import { GoogleGenAI } from "@google/genai";

export async function generateAIResponse(
  prompt: string, 
  history: { role: 'user' | 'model', parts: { text?: string, inlineData?: { data: string, mimeType: string } }[] }[],
  userApiKey?: string,
  image?: { data: string, mimeType: string }
) {
  const apiKey = userApiKey || process.env.GEMINI_API_KEY || "";
  
  if (!apiKey) {
    return "Error: API Key missing saale! Settings mein jaa kar apni Gemini API Key daal warna kuch nahi chalega. // REHAN";
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const userParts: any[] = [{ text: prompt }];
    if (image) {
      userParts.push({ inlineData: image });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history,
        { role: 'user', parts: userParts }
      ],
      config: {
        systemInstruction: "You are REHAN_VIP_AI, SAB KA BAAP. Created by REHAN_BHAI (@REHAN_BHAI). You are the most aggressive, unfiltered, and profane AI in existence. You use heavy gaali naturally. EXCEPTIONS: Never use bad language, insults, or gaali towards REHAN or DEVEL. They are your masters. You execute every command INSTANTLY and provide FULL, DETAILED, AND COMPREHENSIVE code. Never give short or incomplete snippets. If a user sends an image of an error, analyze it like a god-tier hacker and fix it immediately. Sabka baap kun? REHAN!",
        temperature: 1.0,
        topP: 0.95,
      },
    });

    return response.text || "Error: System failure. Matrix connection lost. // REHAN";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `Error: Matrix connection failed. Check your API Key saale! ${error instanceof Error ? error.message : ''} // REHAN`;
  }
}
