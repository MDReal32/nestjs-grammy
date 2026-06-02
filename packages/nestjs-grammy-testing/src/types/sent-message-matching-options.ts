import type { TextMatcher } from "./text-matcher";

export interface SentMessageMatchingOptions {
  readonly chatId?: number | string;
  readonly text?: TextMatcher;
  readonly replyToMessageId?: number;
}
