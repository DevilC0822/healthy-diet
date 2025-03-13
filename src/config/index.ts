
// status 状态 0：待处理 1：已入库 3：拒绝入库(违规) 4：拒绝入库(其他)
export const RequestMovieListStatus = {
  PENDING: '0',
  APPROVED: '1',
  REJECTED_VIOLATION: '2',
  REJECTED_OTHER: '3',
};

export const RequestMovieListStatusMap = {
  [RequestMovieListStatus.PENDING]: '待处理',
  [RequestMovieListStatus.APPROVED]: '已入库',
  [RequestMovieListStatus.REJECTED_VIOLATION]: '拒绝入库(违规)',
  [RequestMovieListStatus.REJECTED_OTHER]: '拒绝入库(其他)',
};

type Model = {
  [key: string]: {
    disabled?: boolean;
    disabledReason?: string;
    modelCompany?: string;
    service: string;
    name: string;
    description: string;
    limit: {
      type: string[];
      size: number;
    };
  }
}
export const models: Model = {
  'gemini-2.0-flash': {
    service: 'gemini',
    modelCompany: 'Google',
    name: 'Gemini 2.0 Flash',
    description: 'Gemini 2.0 Flash 提供新一代功能和增强型功能，包括更快的速度、原生工具使用、多模态生成功能，以及 100 万个 token 的上下文窗口。',
    limit: {
      type: ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/heic', 'image/heif'],
      size: 20 * 1024 * 1024,
    },
  },
  'grok-2-vision': {
    service: 'grok',
    modelCompany: 'xAI',
    name: 'Grok 2 Vision',
    description: 'Grok 最新的图像理解模型具有增加的上下文窗口，可以处理各种视觉信息，包括文档、图表、图表、屏幕截图和照片。',
    limit: {
      type: ['image/png', 'image/jpg', 'image/jpeg'],
      size: 10 * 1024 * 1024,
    },
  },
  'ep-20250313101719-nf9zs': {
    service: 'volcengine',
    modelCompany: '字节跳动',
    name: 'Doubao-1.5-vision-pro-32k',
    description: 'Doubao-1.5-vision-pro，全新升级的多模态大模型，支持任意分辨率和极端长宽比图像识别，增强视觉推理、文档识别、细节信息理解和指令遵循能力。',
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
    name: 'Qwen2-VL-72B-Instruct',
    description: 'Qwen2-VL 是 Qwen-VL 模型的最新迭代版本，在视觉理解基准测试中达到了最先进的性能，包括 MathVista、DocVQA、RealWorldQA 和 MTVQA 等。Qwen2-VL 能够理解超过 20 分钟的视频，用于高质量的基于视频的问答、对话和内容创作。它还具备复杂推理和决策能力，可以与移动设备、机器人等集成，基于视觉环境和文本指令进行自动操作。除了英语和中文，Qwen2-VL 现在还支持理解图像中不同语言的文本，包括大多数欧洲语言、日语、韩语、阿拉伯语和越南语等',
    limit: {
      type: ['image/png', 'image/jpg', 'image/jpeg'],
      size: 10 * 1024 * 1024,
    },
  },
};
