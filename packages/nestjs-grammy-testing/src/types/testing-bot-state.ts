import type { Context as GrammyContext } from "grammy";
import type { Update } from "grammy/types";

export interface TestingBotState<TContext extends GrammyContext = GrammyContext> {
  lastContext?: TContext;
  lastUpdate?: Update;
  readonly events: string[];
  readonly errors: unknown[];
}
