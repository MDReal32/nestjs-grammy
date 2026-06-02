import type { TestChatOptions } from "./test-chat-options";
import type { TestUserOptions } from "./test-user-options";

export interface CallbackQueryUpdateOptions {
  readonly updateId?: number;
  readonly callbackQueryId?: string;
  readonly messageId?: number;
  readonly date?: number;
  readonly data?: string;
  readonly chatInstance?: string;
  readonly user?: TestUserOptions;
  readonly chat?: TestChatOptions;
}
