import type { MessageUpdateOptions } from "../types";
import { createTestChat } from "./create-test-chat";
import { createTestUser } from "./create-test-user";
import type { MessageUpdate } from "./message-update";
import { now } from "./now";

export const createMessageUpdate = (options: MessageUpdateOptions = {}): MessageUpdate => {
  const from = createTestUser(options.user);
  const chat = createTestChat({
    id: options.chat?.id ?? from.id,
    first_name: options.chat?.first_name ?? from.first_name,
    username: options.chat?.username ?? from.username,
    last_name: options.chat?.last_name ?? from.last_name
  });

  return {
    update_id: options.updateId ?? 1,
    message: {
      message_id: options.messageId ?? 1,
      date: options.date ?? now(),
      chat,
      from,
      text: options.text ?? "hello"
    }
  };
};
