import { resolve } from "node:path";

import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
  root: resolve(import.meta.dirname, "../.."),
  plugins: [swc.vite()],
  test: {
    include: ["src/**/*.spec.ts"],
    globals: true,
    environment: "node",
    setupFiles: ["@mdreal/nestjs-grammy-testing/vitest"]
  }
});
