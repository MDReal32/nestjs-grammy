import type { TestChatOptions } from "./test-chat-options";
import type { TestUserOptions } from "./test-user-options";

export interface MessageUpdateOptions {
  readonly updateId?: number;
  readonly messageId?: number;
  readonly date?: number;
  readonly text?: string;
  readonly user?: TestUserOptions;
  readonly chat?: TestChatOptions;
}
