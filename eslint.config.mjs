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
    files: ["**/*.ts", "**/*.tsx", "**/*.jsx"],
    rules: {
      "react/no-unescaped-entities": "off", // Cho phép dùng "" trong JSX
      '@typescript-eslint/no-explicit-any': 'off', // Cho phép sử dụng type 'any'
      "@typescript-eslint/no-unused-vars": [  // Bỏ qua bắt lỗi các biến có _ phía trước không dùng
        "error",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_"
        }
      ]
    },
  },
];

export default eslintConfig;
