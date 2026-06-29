import swc from "unplugin-swc";
import { defineConfig } from "vite";
import dtsPlugin from "vite-plugin-dts";

export default defineConfig({
  // Per-entry declarations (no rollup): each framework entry ships its own
  // ambient `declare module`/`declare global` augmentation. A single rolled-up
  // pass (api-extractor) merges/loses those across entries.
  plugins: [swc.vite(), dtsPlugin({ rollupTypes: false, include: ["src"], entryRoot: "src" })],
  build: {
    outDir: "build",
    ssr: true,
    lib: {
      entry: {
        "nestjs-grammy-testing": "src/main.ts",
        "jest": "src/jest.ts",
        "vitest": "src/vitest.ts",
        "bun": "src/bun.ts",
        "expect": "src/expect.ts",
        "playwright": "src/playwright.ts"
      },
      formats: ["es"],
      fileName: (_format, entryName) => `${entryName}.js`
    }
  }
});
