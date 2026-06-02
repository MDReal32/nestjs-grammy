import type { Update } from "grammy/types";

export type CallbackQueryUpdate = Update & { callback_query: NonNullable<Update["callback_query"]> };
