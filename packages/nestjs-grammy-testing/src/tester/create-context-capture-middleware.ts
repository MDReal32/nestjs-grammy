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

import type { TestingBotState } from "../types";

/**
 * `createContextCaptureMiddleware`
 *
 * Creates the Context Capture Middleware value.
 * @param state - The state value.
 * @returns Returns the created value.
 */
export const createContextCaptureMiddleware = <TContext extends GrammyContext>(
  state: TestingBotState<TContext>
): MiddlewareFn<TContext> => {
  return async (ctx, next) => {
    state.lastContext = ctx;
    await next();
  };
};
