import type { Chat } from "grammy/types";

export interface TestChatOptions extends Partial<Chat.PrivateChat> {
  readonly id?: number;
}
