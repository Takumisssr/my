
import { GoogleGenAI, Type } from "@google/genai";
import { FacialAnalysis } from "../types";

const ANALYSIS_PROMPT = `
你是一位拥有20年临床经验的顶级资深整形外科医生及高级面部美学架构师。你现在收到了用户三张不同角度的照片：正脸、侧面（90度）、45度斜侧位。
请结合这三个维度的视觉信息，进行极度专业、严谨且具有医学深度的全方位美学解构。

你的分析任务必须包含以下细节：
1. **正脸分析 (Frontal)**：深度解构“三庭五眼”垂直与水平比例，分析面部对称性、眉眼间距、中面部平整度。
2. **侧面分析 (Lateral)**：重点评估“四高三低”曲线。精确分析鼻唇角（理想90-105°）、额头丰满度、鼻尖表现点、以及下颌缘清晰度与Ricketts E-line（审美平面）。
3. **45度侧位分析 (Oblique)**：观察面部软组织容量分布、苹果肌高点（Malar Mound）、泪沟深度、中面部饱满度及面部光影衔接。
4. **医学级建议**：提供“医美级”手术（如：内眦赘皮矫正术、膨体/硅胶假体植入）及非手术类注射（如：玻尿酸MD Codes动力位点提升、肉毒素咬肌调整）方案。建议必须具备临床参考价值。

输出语言：简体中文。请务必提供极具洞察力的医学级总结，语言风格需专业、理性。
`;

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    overallScore: { type: Type.NUMBER },
    proportions: {
      type: Type.OBJECT,
      properties: {
        threeParts: {
          type: Type.OBJECT,
          properties: {
            upper: { type: Type.NUMBER },
            middle: { type: Type.NUMBER },
            lower: { type: Type.NUMBER },
            description: { type: Type.STRING }
          },
          required: ["upper", "middle", "lower", "description"]
        },
        fiveEyes: {
          type: Type.OBJECT,
          properties: {
            leftSide: { type: Type.NUMBER },
            leftEye: { type: Type.NUMBER },
            middle: { type: Type.NUMBER },
            rightEye: { type: Type.NUMBER },
            rightSide: { type: Type.NUMBER },
            description: { type: Type.STRING }
          },
          required: ["leftSide", "leftEye", "middle", "rightEye", "rightSide", "description"]
        }
      },
      required: ["threeParts", "fiveEyes"]
    },
    features: {
      type: Type.OBJECT,
      properties: {
        eyes: { type: Type.STRING },
        nose: { type: Type.STRING },
        lips: { type: Type.STRING },
        jawline: { type: Type.STRING }
      },
      required: ["eyes", "nose", "lips", "jawline"]
    },
    suggestions: {
      type: Type.OBJECT,
      properties: {
        medicalBeauty: { type: Type.ARRAY, items: { type: Type.STRING } },
        makeup: { type: Type.ARRAY, items: { type: Type.STRING } },
        lifestyle: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["makeup", "medicalBeauty", "lifestyle"]
    },
    summary: { type: Type.STRING }
  },
  required: ["overallScore", "proportions", "features", "suggestions", "summary"]
};

export const analyzeFaceImages = async (frontBase64: string, sideBase64: string, angleBase64: string): Promise<FacialAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { data: frontBase64.split(',')[1], mimeType: 'image/jpeg' } },
        { inlineData: { data: sideBase64.split(',')[1], mimeType: 'image/jpeg' } },
        { inlineData: { data: angleBase64.split(',')[1], mimeType: 'image/jpeg' } },
        { text: ANALYSIS_PROMPT }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      thinkingConfig: { thinkingBudget: 12000 } // Higher budget for much more detailed clinical reasoning
    }
  });

  if (!response.text) {
    throw new Error("AI response was empty");
  }

  return JSON.parse(response.text) as FacialAnalysis;
};
