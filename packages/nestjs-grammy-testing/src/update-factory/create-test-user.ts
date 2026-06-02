import type { User } from "grammy/types";

import type { TestUserOptions } from "../types";

export const createTestUser = (options: TestUserOptions = {}): User => ({
  id: options.id ?? 1,
  is_bot: options.is_bot ?? false,
  first_name: options.first_name ?? "Test",
  username: options.username,
  last_name: options.last_name,
  language_code: options.language_code,
  is_premium: options.is_premium,
  added_to_attachment_menu: options.added_to_attachment_menu
});
