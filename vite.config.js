/// <reference types="vitest" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  test: {
    // 1. グローバル変数（expect, describe, itなど）をインポートなしで使えるようにする
    globals: true,
    // 2. ブラウザ環境をjsdomに設定
    environment: "jsdom",
    // 3. テスト前に実行するセットアップファイル
    setupFiles: "./src/test/setup.js",
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  coverage: {
    provider: "v8",
    reporter: ["text", "json", "html"],
    all: true,
    include: ["src/**/*.{js,jsx}"],
    exclude: ["src/main.jsx", "src/test/**"],
  },
});
