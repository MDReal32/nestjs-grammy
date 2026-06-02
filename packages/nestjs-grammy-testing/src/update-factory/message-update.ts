import type { Message, Update } from "grammy/types";

export type MessageUpdate = Update & { message: Message.TextMessage };
