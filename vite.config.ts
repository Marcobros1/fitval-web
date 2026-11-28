/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom", // el navegador de mentira
    setupFiles: "./src/test/setup.ts", // se ejecuta antes de los tests
  },
});
