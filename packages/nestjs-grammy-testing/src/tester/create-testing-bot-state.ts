import type { Context as GrammyContext } from "grammy";

import type { TestingBotState } from "../types";

export const createTestingBotState = <TContext extends GrammyContext>(): TestingBotState<TContext> => ({
  events: [],
  errors: []
});
