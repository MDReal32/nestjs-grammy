import type { Context as GrammyContext, MiddlewareFn } from "grammy";

import type { TestingBotState } from "../types";

export const createContextCaptureMiddleware = <TContext extends GrammyContext>(
  state: TestingBotState<TContext>
): MiddlewareFn<TContext> => {
  return async (ctx, next) => {
    state.lastContext = ctx;
    await next();
  };
};
