import { GoogleGenAI, Type } from "@google/genai";
import { QuoteData, LineItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateLineItemsFromPrompt = async (prompt: string): Promise<LineItem[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Génère une liste détaillée d'articles pour un devis professionnel basé sur la demande suivante : "${prompt}".
      Crée des descriptions réalistes, des quantités estimées et des prix unitaires réalistes en euros.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              description: { type: Type.STRING },
              quantity: { type: Type.NUMBER },
              unitPrice: { type: Type.NUMBER }
            },
            required: ["description", "quantity", "unitPrice"]
          }
        }
      }
    });

    const rawData = response.text;
    if (!rawData) return [];
    
    const items = JSON.parse(rawData);
    
    // Add IDs
    return items.map((item: any) => ({
      ...item,
      id: crypto.randomUUID()
    }));

  } catch (error) {
    console.error("Error generating items:", error);
    throw error;
  }
};

export const improveQuoteNotes = async (currentNotes: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Améliore, corrige et rend plus professionnel le texte suivant destiné à la section "Notes" ou "Termes" d'un devis client : "${currentNotes}".
      Reste concis et courtois.`,
    });
    return response.text || currentNotes;
  } catch (error) {
    console.error("Error improving notes:", error);
    return currentNotes;
  }
};