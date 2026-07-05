import type { GrammyMatcherAssertions } from "../build/nestjs-grammy-testing.js";

declare module "vitest" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Assertion<T = any> extends GrammyMatcherAssertions<T> {}
  interface AsymmetricMatchersContaining extends GrammyMatcherAssertions<void> {}
}

export {};
