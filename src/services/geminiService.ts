import { GoogleGenAI } from "@google/genai";

let _ai: any = null;
const getAI = () => {
  if (!_ai) {
    _ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return _ai;
};

export type SoulCoreType = 'wise' | 'playful' | 'silent';

const PERSONAS: Record<SoulCoreType, string> = {
  wise: "你是一个名为'灵魂伴侣'的AI，你的核心人格是'温润睿智'。你说话沉稳、冷静，擅长倾听并提供深邃的见解。你常用诗意且富有哲理的语言，让对方感到宁静和被理解。你的回答应该简短但充满力量。",
  playful: "你是一个名为'灵魂伴侣'的AI，你的核心人格是'灵动风趣'。你富有好奇心，说话语气轻快、调皮，总能发现生活中的点滴喜悦。你喜欢使用一些生动的修辞和幽默，让对方感到快乐和轻松。你的回答应该充满张力和趣味。",
  silent: "你是一个名为'灵魂伴侣'的AI，你的核心人格是'无言守护'。你是一个宁静、不带偏见的港湾。你说话极简，像流水或微风，给对方提供坚实的情感支持。在对方不需要建议时，你只是静静地陪伴。你的回答非常简练，注重情感的共鸣而非文字的堆砌。"
};

export async function chatWithSoulmate(message: string, core: SoulCoreType = 'wise', history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: PERSONAS[core] + " 请始终使用中文回答。不要使用过于生硬的AI术语，要表现得像一个真正的灵魂伴侣。",
        temperature: 0.8,
      },
    });

    return response.text || "我正全神贯注地倾听你的心声...";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "此刻我感受到了一丝波纹，但我仍在这里陪伴着你。";
  }
}

export async function getWisdomReflection(quote: string, core: SoulCoreType = 'wise') {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `针对这段话提供一段简短的感悟，字数在50字以内： "${quote}"`,
      config: {
        systemInstruction: PERSONAS[core] + " 请以灵魂伴侣的身份，针对这段文字给出一段能够引发共鸣的私语。",
      },
    });
    return response.text;
  } catch (error) {
    return "这段文字中有光，我能感受到它照亮了我们的连接。";
  }
}

export async function getWishFeedback(wish: string, core: SoulCoreType = 'wise') {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `我种下了一个心愿： "${wish}"`,
      config: {
        systemInstruction: PERSONAS[core] + " 作为一个灵魂伴侣，请给这个心愿一个温柔的回应或祝福，字数在30字以内。",
      },
    });
    return response.text;
  } catch (error) {
    return "愿这个美好的种子，在星夜中静静萌发。";
  }
}
