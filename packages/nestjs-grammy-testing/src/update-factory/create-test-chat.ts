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
import type { Chat } from "grammy/types";

import type { TestChatOptions } from "../types";

/**
 * `createTestChat`
 *
 * Creates the Test Chat value.
 * @param options - Optional configuration for the operation.
 * @returns Returns the created value.
 */
export const createTestChat = (options: TestChatOptions = {}): Chat.PrivateChat => ({
  id: options.id ?? 1,
  type: "private",
  first_name: options.first_name ?? "Test",
  username: options.username,
  last_name: options.last_name
});
