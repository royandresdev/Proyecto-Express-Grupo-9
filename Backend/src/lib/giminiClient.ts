
import { GoogleGenerativeAI } from "@google/generative-ai";
import env from "../config/config"

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY); 

export const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const generateContentWithRetry = async (prompt: string, retries = 3): Promise<any> => {
  try {
    return await model.generateContent(prompt);
  } catch (error: any) {
    if (error.statusCode === 429 && retries > 0) {
      const retryAfter = error.retryDelaySeconds || 20;
      console.log(`Rate limit exceeded, retrying in ${retryAfter}s...`);
      await new Promise(r => setTimeout(r, retryAfter * 1000));
      return generateContentWithRetry(prompt, retries - 1);
    }
    throw error;
  }
};
