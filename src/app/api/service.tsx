import OpenAI from "openai";

export const grokService = new OpenAI({
  baseURL: 'https://api.x.ai/v1',
  apiKey: process.env.GROK_KEY,
});

export const siliconflowService = new OpenAI({
  baseURL: 'https://api.siliconflow.com',
  apiKey: process.env.SILICONFLOW_KEY,
});

export const geminiService = new OpenAI({
  baseURL: 'https://generativelanguage.googleapis.com/v1beta',
  apiKey: process.env.GEMINI_KEY,
});

const ServiceMap: { [key: string]: OpenAI } = {
  grok: grokService,
  siliconflow: siliconflowService,
  gemini: geminiService,
}

export const getService = (service: string) => {
  if (!ServiceMap[service]) {
    throw new Error(`Service ${service} not found`);
  }
  return ServiceMap[service];
}
