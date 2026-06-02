import type { GrammyMatcherAssertions } from "../types";

declare global {
  namespace jest {
    interface Matchers<R> extends GrammyMatcherAssertions<R> {}
  }
}
