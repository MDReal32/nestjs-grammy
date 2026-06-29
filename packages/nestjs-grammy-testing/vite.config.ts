import swc from "unplugin-swc";
import { defineConfig } from "vite";
import dtsPlugin from "vite-plugin-dts";

export default defineConfig({
  // rollupTypes is intentionally off: the framework entry points
  // (jest/vitest) ship ambient `declare module`/`declare global`
  // augmentations that api-extractor mangles when bundling multiple entries.
  // entryRoot/include keep declarations rooted at build/ (not build/src/).
  plugins: [swc.vite(), dtsPlugin({ rollupTypes: false, include: ["src"], entryRoot: "src" })],
  ssr: {
    external: ["@mdreal/nestjs-grammy", "@nestjs/common", "@nestjs/core", "@nestjs/testing", "grammy", "vitest"]
  },
  build: {
    outDir: "build",
    ssr: true,
    lib: {
      entry: {
        "nestjs-grammy-testing": "src/main.ts",
        "jest": "src/jest.ts",
        "vitest": "src/vitest.ts"
      },
      formats: ["es", "cjs"],
      fileName: (format, entryName) => `${entryName}.${format === "cjs" ? "cjs" : "js"}`
    }
  }
});
