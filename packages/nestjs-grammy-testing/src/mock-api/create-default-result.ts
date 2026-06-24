/*
 * Copyright 2025 MDReal
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import type { UserFromGetMe } from "grammy/types";

/**
 * `createDefaultResult`
 *
 * Creates the Default Result value.
 * @param botInfo - The bot metadata used to seed the mock API.
 * @returns Returns the created value.
 */
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
