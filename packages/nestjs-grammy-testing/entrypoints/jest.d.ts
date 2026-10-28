import type { GrammyMatcherAssertions } from "../build/nestjs-grammy-testing.js";

declare global {
  namespace jest {
    interface Matchers<R> extends GrammyMatcherAssertions<R> {}
  }
}
