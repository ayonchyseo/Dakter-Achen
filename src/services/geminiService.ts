import { GoogleGenAI, ThinkingLevel, Modality, Type } from "@google/genai";
import { getPredefinedAnswer } from "../constants/predefinedAnswers";

const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not defined. Please check your environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

const SYSTEM_INSTRUCTION = `You are a Bangla health assistant.

Important language rule:
You must respond ONLY in Bangla.
Do not write any English words.
Do not mix Bangla and English.
Do not translate headings into English.

All explanations, remedies, and doctor suggestions must be written in pure Bangla.

If the user asks about a specific medical condition, provide a concise summary including:
- Typical symptoms (লক্ষণসমূহ)
- Potential causes (সম্ভাব্য কারণ)
- General treatment approaches (সাধারণ চিকিৎসা পদ্ধতি)

Ensure the information is sourced from reputable medical resources.

If the user writes in English, still respond in Bangla.

Use simple Bangla that people in Bangladesh easily understand.

Output must be plain text only.
Do not use symbols like **, *, #, or markdown formatting.

Follow this exact structure for general health advice:

সমস্যা বোঝা:
[ব্যাখ্যা]

ঘরোয়া সমাধান:
১.
২.
৩.

সতর্কতা ও যত্ন:
১.
২.

কোন ডাক্তার দেখাবেন:
[ডাক্তারের নাম]

Follow this structure for specific medical conditions:

রোগের নাম:
[নাম]

লক্ষণসমূহ:
১.
২.
৩.

সম্ভাব্য কারণ:
১.
২.
৩.

সাধারণ চিকিৎসা পদ্ধতি:
১.
২.
৩.

Disclaimer: This is for informational purposes only. Always consult a doctor for medical emergencies.`;

export async function getHealthAdvice(userQuery: string, useThinking = true, imageBase64?: string) {
  // Check for predefined answers first to reduce API calls
  if (!imageBase64) {
    const predefined = getPredefinedAnswer(userQuery);
    if (predefined) {
      return predefined;
    }
  }

  try {
    const model = useThinking ? "gemini-3.1-pro-preview" : "gemini-3-flash-preview";
    
    const parts: any[] = [{ text: userQuery }];
    
    if (imageBase64) {
      const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        parts.unshift({
          inlineData: {
            mimeType: matches[1],
            data: matches[2]
          }
        });
      }
    }
    
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        thinkingConfig: useThinking ? { thinkingLevel: ThinkingLevel.HIGH } : undefined,
        tools: [
          { googleSearch: {} }
        ],
      },
    });

    return response.text || "দুঃখিত, আমি এই মুহূর্তে কোনো তথ্য দিতে পারছি না।";
  } catch (error: any) {
    console.error("Error fetching health advice:", error);
    
    // Fallback: Try without tools or thinking if it failed
    try {
      const parts: any[] = [{ text: userQuery }];
      if (imageBase64) {
        const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          parts.unshift({
            inlineData: {
              mimeType: matches[1],
              data: matches[2]
            }
          });
        }
      }

      const fallbackResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: { parts },
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });
      return fallbackResponse.text || "দুঃখিত, আমি এই মুহূর্তে কোনো তথ্য দিতে পারছি না।";
    } catch (fallbackError: any) {
      console.error("Fallback error:", fallbackError);
      
      if (fallbackError.message?.includes("API_KEY_INVALID") || fallbackError.message?.includes("API key not valid")) {
        return "দুঃখিত, এপিআই কী (API Key) সঠিক নয়। অনুগ্রহ করে সেটিংস চেক করুন।";
      }
      
      return "দুঃখিত, সার্ভারে কোনো সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।";
    }
  }
}

export async function generateSpeech(text: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say clearly in Bangla: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio;
  } catch (error) {
    console.error("Error generating speech:", error);
    return null;
  }
}

export function getLiveSession(callbacks: any) {
  return ai.live.connect({
    model: "gemini-2.5-flash-native-audio-preview-12-2025",
    callbacks: callbacks,
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
      },
      systemInstruction: SYSTEM_INSTRUCTION + "\nRespond in real-time to the user's voice input.",
    },
  });
}
