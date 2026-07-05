import type { GrammyMatcherAssertions } from "../build/nestjs-grammy-testing.js";

declare module "expect" {
  interface Matchers<R, T = unknown> extends GrammyMatcherAssertions<R> {}
  interface AsymmetricMatchers extends GrammyMatcherAssertions<void> {}
}

export {};
