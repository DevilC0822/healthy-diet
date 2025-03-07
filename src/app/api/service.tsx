import OpenAI from "openai";

export const grokToken = 'xai-S3j4rkjdHRIVTZ6LDYBRuQ8yp0H9Ku7uJ8pFw9XudnKPKhPyoTyCZxwQv3WmfKeFKQtrf26oQbjej90T';
export const siliconflowToken = 'sk-ljtaqxpshcfutomirqahchnsqfppnfnubldecssezabwglrc';
export const gminiToken = 'AIzaSyDXeX0c4fn9lapCOAoG2dmmqtWmwa7cE40';

export const grokService = new OpenAI({
  baseURL: 'https://api.x.ai/v1',
  apiKey: grokToken,
});

export const siliconflowService = new OpenAI({
  baseURL: 'https://api.siliconflow.com',
  apiKey: siliconflowToken
});

export const geminiService = new OpenAI({
  baseURL: 'https://generativelanguage.googleapis.com/v1beta',
  apiKey: gminiToken
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
