import type { ExpectLike } from "../types";
import { grammyMatchers } from "./grammy-matchers";

export const registerGrammyMatchers = (expectLike?: ExpectLike) => {
  const target = expectLike ?? (globalThis as typeof globalThis & { expect?: ExpectLike }).expect;

  if (!target) {
    return;
  }

  target.extend(grammyMatchers);
};
