import type { UserFromGetMe } from "grammy/types";

export const createDefaultResult = (botInfo: UserFromGetMe) => (method: string, payload: unknown) => {
  if (method === "getMe") {
    return botInfo;
  }

  if (method === "sendMessage") {
    const data = payload as { chat_id?: number | string; text?: string };

    return {
      message_id: 1,
      date: Math.floor(Date.now() / 1000),
      chat: {
        id: data.chat_id ?? 1,
        type: "private"
      },
      text: data.text ?? ""
    };
  }

  return true;
};
