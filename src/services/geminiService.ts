import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function performAudit(amount: string, reason: string, policies: any[]) {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `你是一位专业的住宅专项维修资金审计专家。
你的任务是根据提供的申请详情和政策法规，进行合规性审查。
输出必须是 JSON 格式。`;

  const prompt = `
申请金额: ${amount}
申请缘由: ${reason}

相关政策依据:
${policies.map(p => `- ${p.title}: ${p.content}`).join('\n')}

请分析：
1. 是否符合维修资金支取范围？
2. 逻辑漏洞（如金额异常、日期逻辑错误等）。
3. 风险级别（低、中、高）。
4. 审计结论及建议。

输出 JSON 格式:
{
  "compliance": boolean,
  "logicCheck": string,
  "riskLevel": "Low" | "Medium" | "High",
  "detailedFindings": string[],
  "conclusion": string
}`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });
    
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("AI Audit failed:", error);
    throw error;
  }
}
