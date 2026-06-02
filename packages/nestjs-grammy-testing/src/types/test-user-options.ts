import type { User } from "grammy/types";

export interface TestUserOptions extends Partial<User> {
  readonly id?: number;
}
