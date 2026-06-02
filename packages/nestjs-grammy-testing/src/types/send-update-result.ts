import type { Context as GrammyContext } from "grammy";
import type { Update } from "grammy/types";

import type { MockTelegramApi } from "../mock-api";

export interface SendUpdateResult<TContext extends GrammyContext = GrammyContext> {
  readonly update: Update;
  readonly context?: TContext;
  readonly api: MockTelegramApi;
}
