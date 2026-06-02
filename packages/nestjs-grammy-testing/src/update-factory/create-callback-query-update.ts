import type { Message } from "grammy/types";

import type { CallbackQueryUpdateOptions } from "../types";
import type { CallbackQueryUpdate } from "./callback-query-update";
import { createTestChat } from "./create-test-chat";
import { createTestUser } from "./create-test-user";
import { now } from "./now";

export const createCallbackQueryUpdate = (options: CallbackQueryUpdateOptions = {}): CallbackQueryUpdate => {
  const from = createTestUser(options.user);
  const chat = createTestChat({
    id: options.chat?.id ?? from.id,
    first_name: options.chat?.first_name ?? from.first_name,
    username: options.chat?.username ?? from.username,
    last_name: options.chat?.last_name ?? from.last_name
  });

  const message: Message.TextMessage = {
    message_id: options.messageId ?? 1,
    date: options.date ?? now(),
    chat,
    from,
    text: "callback source"
  };

  return {
    update_id: options.updateId ?? 1,
    callback_query: {
      id: options.callbackQueryId ?? "callback-query-id",
      from,
      chat_instance: options.chatInstance ?? "test-chat-instance",
      message,
      data: options.data ?? "test-callback"
    }
  };
};
