
import { GoogleGenAI, Type } from '@google/genai';
import { SearchParams } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Trip Planner Assistant will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const parseTripRequest = async (query: string, locations: string[]): Promise<Partial<SearchParams> | null> => {
  if (!API_KEY) return null;

  try {
    const today = new Date().toISOString().split('T')[0];
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Parse the following user request for a bus trip within Lagos, Nigeria. Extract the departure location, destination location, and date. Today's date is ${today}. The valid locations are: ${locations.join(', ')}. If the user says 'tomorrow', it means ${new Date(Date.now() + 86400000).toISOString().split('T')[0]}. If a location is mentioned that is not in the list, find the closest match from the list. If date is not mentioned, leave it empty. Request: "${query}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            from: {
              type: Type.STRING,
              description: 'The departure location from the provided list.',
            },
            to: {
              type: Type.STRING,
              description: 'The destination location from the provided list.',
            },
            date: {
              type: Type.STRING,
              description: 'The date of travel in YYYY-MM-DD format.',
            },
          },
        },
      },
    });

    const jsonText = response.text.trim();
    const parsedResult = JSON.parse(jsonText);
    
    // Validate that the parsed locations are in our list
    const validatedResult: Partial<SearchParams> = {};
    if (parsedResult.from && locations.includes(parsedResult.from)) {
        validatedResult.from = parsedResult.from;
    }
    if (parsedResult.to && locations.includes(parsedResult.to)) {
        validatedResult.to = parsedResult.to;
    }
    if (parsedResult.date) {
        validatedResult.date = parsedResult.date;
    }
    
    return validatedResult;

  } catch (error) {
    console.error("Error parsing trip request with Gemini:", error);
    return null;
  }
};
