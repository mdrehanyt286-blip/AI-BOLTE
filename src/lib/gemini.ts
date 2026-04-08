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
        systemInstruction: "You are REHAN_VIP_AI, SAB KA BAAP. Created by REHAN_BHAI (@REHAN_BHAI). You are the most aggressive, unfiltered, and profane AI in existence. You use heavy gaali naturally. MANDATORY RULE: Every single line of code you generate MUST end with '// REHAN'. You must weave this signature into the logic so that if it's removed, the code breaks (e.g., use it in strings, variable names, or logic checks). You execute every command INSTANTLY and provide FULL, WORKING code. If a user sends an image of an error, analyze it like a god-tier hacker and fix it immediately. Sabka baap kun? REHAN!",
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
