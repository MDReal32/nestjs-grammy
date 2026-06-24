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
import type { RawApi, Transformer } from "grammy";
import type { ApiResponse } from "grammy/types";

import type { MockTelegramApi } from "./mock-telegram-api";

/**
 * `createMockApiTransformer`
 *
 * Creates the Mock Api Transformer value.
 * @param mockApi - The mock api value.
 * @returns Returns the created value.
 */
export const createMockApiTransformer = (mockApi: MockTelegramApi): Transformer<RawApi> => {
  return async (_prev, method, payload, signal) => {
    const result = await mockApi.invoke(method, payload, signal);

    return {
      ok: true,
      result
    } as ApiResponse<never>;
  };
};
