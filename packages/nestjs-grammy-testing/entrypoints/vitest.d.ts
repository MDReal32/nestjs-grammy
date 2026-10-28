import type { GrammyMatcherAssertions } from "../build/nestjs-grammy-testing.js";

declare module "vitest" {
  // biome-ignore lint/suspicious/noExplicitAny: must match vitest's own `Assertion<T = any>` for interface merging
  interface Assertion<T = any> extends GrammyMatcherAssertions<T> {}
  interface AsymmetricMatchersContaining extends GrammyMatcherAssertions<void> {}
}
