import type { UserFromGetMe } from "grammy/types";

export interface TestBotInfoOptions extends Partial<UserFromGetMe> {
  readonly id?: number;
}
