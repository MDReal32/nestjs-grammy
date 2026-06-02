import type { Chat } from "grammy/types";

import type { TestChatOptions } from "../types";

export const createTestChat = (options: TestChatOptions = {}): Chat.PrivateChat => ({
  id: options.id ?? 1,
  type: "private",
  first_name: options.first_name ?? "Test",
  username: options.username,
  last_name: options.last_name
});
