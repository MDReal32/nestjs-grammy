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
import type { UserFromGetMe } from "grammy/types";

import { createTestBotInfo } from "../update-factory";
import { createDefaultResult } from "./create-default-result";
import { createMockFunction } from "./create-mock-function";
import type { MockApiCall } from "./mock-api-call";
import type { MockApiFunction } from "./mock-api-function";
import type { MockTelegramApi } from "./mock-telegram-api";

/**
 * `createMockApi`
 *
 * Creates the Mock Api value.
 * @param botInfo - The bot metadata used to seed the mock API.
 * @returns Returns the created value.
 */
export const createMockApi = (botInfo: UserFromGetMe = createTestBotInfo()): MockTelegramApi => {
  const calls: MockApiCall[] = [];
  const functions = new Map<string, MockApiFunction>();
  const resolveResult = createDefaultResult(botInfo);

  const getFunction = (method: string) => {
    let fn = functions.get(method);

    if (!fn) {
      fn = createMockFunction(method, calls, resolveResult);
      functions.set(method, fn);
    }

    return fn;
  };

  const target = {
    calls,
    clear() {
      calls.length = 0;
      for (const fn of functions.values()) {
        fn.mockClear();
      }
    },
    callsFor(method: string) {
      return calls.filter(call => call.method === method);
    },
    async invoke(method: string, payload: unknown, signal?: unknown) {
      return getFunction(method)(payload, signal);
    }
  };

  return new Proxy(target, {
    get(source, property, receiver) {
      if (typeof property !== "string") {
        return Reflect.get(source, property, receiver);
      }

      if (property in source) {
        return Reflect.get(source, property, receiver);
      }

      return getFunction(property);
    }
  }) as MockTelegramApi;
};
