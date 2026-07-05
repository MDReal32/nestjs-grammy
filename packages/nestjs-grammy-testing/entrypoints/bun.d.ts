import type { GrammyMatcherAssertions } from "../build/nestjs-grammy-testing.js";

declare module "bun:test" {
  interface Matchers<T = unknown> extends GrammyMatcherAssertions<T> {}
  interface AsymmetricMatchers extends GrammyMatcherAssertions<unknown> {}
}

export {};
