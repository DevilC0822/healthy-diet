## 项目简介

一个借助 AI 能力，识别图片配料表的 Web 全栈应用。

## 技术栈

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Heroui](https://heroui.com/)
- [MongoDB](https://www.mongodb.com/)

## 功能

- 调用各个 AI 模型，识别图片配料表
- 移动端适配
- 暗黑和亮色主题
- 使用 RSA 进行数据加密
- 使用 JWT 进行用户认证
- 使用 MongoDB 存储数据
- 数据可视化(规划中...)
- i18n 国际化(规划中...)

## 配置

### 创建 .env.local 文件
```bash
cp .env.example .env.local
```

### 配置环境变量

```bash
# MongoDB 连接字符串
MONGODB_URI=

# AI 服务 API key
GROK_KEY=
SILICONFLOW_KEY=
GEMINI_KEY=

# JWT 密钥
JWT_SECRET=

# RSA 密钥对(使用 base64 编码)
RSA_PRIVATE_KEY=
RSA_PUBLIC_KEY=
```

## 运行

```bash
npm install
npm run dev
```

## 部署

```bash
npm run build
npm run start
```


