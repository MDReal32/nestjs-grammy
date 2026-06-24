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
import type { MessageUpdateOptions } from "../types";
import { createTestChat } from "./create-test-chat";
import { createTestUser } from "./create-test-user";
import type { MessageUpdate } from "./message-update";
import { now } from "./now";

/**
 * `createMessageUpdate`
 *
 * Creates the Message Update value.
 * @param options - Optional configuration for the operation.
 * @returns Returns the created value.
 */
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
