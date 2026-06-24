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

import type { TestBotInfoOptions } from "../types";

/**
 * `createTestBotInfo`
 *
 * Creates the Test Bot Info value.
 * @param options - Optional configuration for the operation.
 * @returns Returns the created value.
 */
export const createTestBotInfo = (options: TestBotInfoOptions = {}): UserFromGetMe => ({
  id: options.id ?? 42,
  is_bot: true,
  first_name: options.first_name ?? "Test Bot",
  username: options.username ?? "test_bot",
  can_join_groups: options.can_join_groups ?? true,
  can_read_all_group_messages: options.can_read_all_group_messages ?? false,
  supports_inline_queries: options.supports_inline_queries ?? false,
  can_connect_to_business: options.can_connect_to_business ?? false,
  can_manage_bots: options.can_manage_bots ?? false,
  allows_users_to_create_topics: options.allows_users_to_create_topics ?? false,
  has_topics_enabled: options.has_topics_enabled ?? false,
  has_main_web_app: options.has_main_web_app ?? false
});
