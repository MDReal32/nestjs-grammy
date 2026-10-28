import type { GrammyMatcherAssertions } from "../build/nestjs-grammy-testing.js";

declare module "@playwright/test" {
  interface Matchers<R, T = unknown> extends GrammyMatcherAssertions<R> {}
}
