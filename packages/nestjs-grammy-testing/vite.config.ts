import swc from "unplugin-swc";
import { defineConfig } from "vite";
import dtsPlugin from "vite-plugin-dts";

export default defineConfig({
  plugins: [swc.vite(), dtsPlugin({ rollupTypes: true })],
  ssr: {
    external: ["@mdreal/nestjs-grammy", "@nestjs/common", "@nestjs/core", "@nestjs/testing", "grammy"]
  },
  build: {
    outDir: "build",
    ssr: true,
    lib: {
      entry: { "nestjs-grammy-testing": "src/main.ts" },
      formats: ["es", "cjs"],
      fileName: (format, entryName) => `${entryName}.${format === "cjs" ? "cjs" : "js"}`
    }
  }
});
