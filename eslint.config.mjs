import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      'react-hooks/exhaustive-deps': 0, // 关闭 exhaustive-deps
      'comma-dangle': ['error', 'always-multiline'], // 必须使用尾随逗号
      'semi': ['error', 'always'], // 强制结尾分号
    },
  },
];

export default eslintConfig;
