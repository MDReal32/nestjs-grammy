// @ts-check
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
  {
    ignores: ["dist", "node_modules", "coverage", "build"]
  },

  tseslint.configs.recommended
);
