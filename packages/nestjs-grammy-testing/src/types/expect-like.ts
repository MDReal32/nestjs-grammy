import type { MatcherFunction } from "./matcher-function";

export interface ExpectLike {
  extend(matchers: Record<string, MatcherFunction>): void;
}
