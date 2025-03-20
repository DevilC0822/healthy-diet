import { I18nKey } from '@/i18n';

type Model = {
  [key: string]: {
    disabled?: boolean;
    disabledReason?: string;
    modelCompany: string;
    modelCompanyEn: string;
    service: string;
    label: string;
    icon: string;
    website: string;
    description: string;
    descriptionEn: string;
    limit: {
      type: string[];
      size: number;
    };
  }
}
export const models: Model = {
  'gemini-2.0-flash': {
    service: 'gemini',
    modelCompany: '谷歌',
    modelCompanyEn: 'Google',
    label: 'Gemini 2.0 Flash',
    icon: 'gemini',
    description: 'Gemini 2.0 Flash 提供新一代功能和增强型功能，包括更快的速度、原生工具使用、多模态生成功能，以及 100 万个 token 的上下文窗口。',
    descriptionEn: 'Gemini 2.0 Flash provides next-generation capabilities and enhanced features, including faster speeds, native tool usage, multimodal generation, and a 1 million token context window.',
    website: 'https://gemini.google.com/',
    limit: {
      type: ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/heic', 'image/heif'],
      size: 20 * 1024 * 1024,
    },
  },
  'grok-2-vision': {
    service: 'grok',
    modelCompany: 'xAI',
    modelCompanyEn: 'xAI',
    label: 'Grok 2 Vision',
    icon: 'grok',
    description: 'Grok 最新的图像理解模型具有增加的上下文窗口，可以处理各种视觉信息，包括文档、图表、图表、屏幕截图和照片。',
    descriptionEn: `Grok's latest image understanding model has an increased context window and can process various visual information, including documents, charts, graphs, screenshots, and photographs.`,
    website: 'https://grok.com/',
    limit: {
      type: ['image/png', 'image/jpg', 'image/jpeg'],
      size: 10 * 1024 * 1024,
    },
  },
  'doubao-1-5-vision-pro-32k-250115': {
    service: 'volcengine',
    modelCompany: '字节跳动',
    modelCompanyEn: 'ByteDance',
    label: 'Doubao-1.5-vision-pro-32k',
    icon: 'doubao',
    description: 'Doubao-1.5-vision-pro，全新升级的多模态大模型，支持任意分辨率和极端长宽比图像识别，增强视觉推理、文档识别、细节信息理解和指令遵循能力。',
    descriptionEn: 'Doubao-1.5-vision-pro, a newly upgraded multimodal large model that supports image recognition at any resolution and extreme aspect ratios, enhancing visual reasoning, document recognition, detailed information understanding, and instruction following capabilities.',
    website: 'https://volcengine.com/L/XCKSzRRrE24',
    limit: {
      type: ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/gif', 'image/bmp', 'image/x-icon', 'image/tiff'],
      size: 10 * 1024 * 1024,
    },
  },
  'Qwen/Qwen2-VL-72B-Instruct': {
    disabled: true,
    disabledReason: '不稳定，暂停使用',
    service: 'siliconflow',
    modelCompany: '阿里巴巴',
    modelCompanyEn: 'Alibaba',
    label: 'Qwen2-VL-72B-Instruct',
    icon: 'qwen',
    description: 'Qwen2-VL 是 Qwen-VL 模型的最新迭代版本，在视觉理解基准测试中达到了最先进的性能，包括 MathVista、DocVQA、RealWorldQA 和 MTVQA 等。Qwen2-VL 能够理解超过 20 分钟的视频，用于高质量的基于视频的问答、对话和内容创作。它还具备复杂推理和决策能力，可以与移动设备、机器人等集成，基于视觉环境和文本指令进行自动操作。除了英语和中文，Qwen2-VL 现在还支持理解图像中不同语言的文本，包括大多数欧洲语言、日语、韩语、阿拉伯语和越南语等',
    descriptionEn: 'Qwen2-VL is the latest iteration of the Qwen-VL model, achieving state-of-the-art performance on visual understanding benchmarks, including MathVista, DocVQA, RealWorldQA, and MTVQA. Qwen2-VL can understand over 20 minutes of video, for high-quality video-based question answering, dialogue, and content creation. It also possesses complex reasoning and decision-making abilities, and can be integrated with mobile devices, robots, etc., for automated operation based on visual environment and text instructions. In addition to English and Chinese, Qwen2-VL now also supports understanding text in different languages within images, including most European languages, Japanese, Korean, Arabic, and Vietnamese, etc.',
    website: 'https://cloud.siliconflow.cn/i/3CEgtlMk',
    limit: {
      type: ['image/png', 'image/jpg', 'image/jpeg'],
      size: 10 * 1024 * 1024,
    },
  },
};

export const roleOptions = [
  { label: I18nKey.optionAll, value: '' },
  { label: I18nKey.admin, value: 'admin' },
  { label: I18nKey.onlyReadAdmin, value: 'onlyReadAdmin' },
  { label: I18nKey.user, value: 'user' },
];