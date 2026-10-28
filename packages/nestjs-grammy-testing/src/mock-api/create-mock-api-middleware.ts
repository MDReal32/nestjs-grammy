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
import type { Context as GrammyContext, MiddlewareFn } from "grammy";

import { createMockApiTransformer } from "./create-mock-api-transformer";
import type { MockTelegramApi } from "./mock-telegram-api";

/**
 * `createMockApiMiddleware`
 *
 * Creates middleware that routes each update's `ctx.api` calls to the mock API.
 * grammY v2 builds a fresh `ctx.api` per update, so transformers installed on
 * `bot.api` do not reach handlers.
 * @param mockApi - The mock Telegram API that records and answers calls.
 * @returns Returns the created value.
 */
export const createMockApiMiddleware = <TContext extends GrammyContext>(
  mockApi: MockTelegramApi
): MiddlewareFn<TContext> => {
  return async (ctx, next) => {
    ctx.api.transform(createMockApiTransformer(mockApi));
    await next();
  };
};
