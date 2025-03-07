
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
    name: 'Gemini 2.0 Flash',
    description: 'Gemini 2.0 Flash 提供新一代功能和增强型功能，包括更快的速度、原生工具使用、多模态生成功能，以及 100 万个 token 的上下文窗口。',
    limit: {
      type: ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/heic', 'image/heif'],
      size: 20 * 1024 * 1024,
    },
  },
  'grok-2-vision': {
    service: 'grok',
    name: 'Grok 2 Vision',
    description: 'Grok 最新的图像理解模型具有增加的上下文窗口，可以处理各种视觉信息，包括文档、图表、图表、屏幕截图和照片。',
    limit: {
      type: ['image/png', 'image/jpg', 'image/jpeg'],
      size: 10 * 1024 * 1024,
    },
  }
};

