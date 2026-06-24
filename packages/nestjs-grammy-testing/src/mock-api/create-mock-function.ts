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
import type { MockApiCall } from "./mock-api-call";
import type { MockApiFunction } from "./mock-api-function";

/**
 * `createMockFunction`
 *
 * Creates the Mock Function value.
 * @param method - The Telegram API method name.
 * @param calls - The recorded API calls.
 * @param resolveResult - The resolve result value.
 * @returns Returns the created value.
 */
export const createMockFunction = (
  method: string,
  calls: MockApiCall[],
  resolveResult: (method: string, payload: unknown) => unknown
): MockApiFunction => {
  const fn = ((payload?: unknown, signal?: unknown) => {
    calls.push({
      method,
      payload: payload ?? {},
      signal
    });
    fn.mock.calls.push(payload === undefined ? [] : [payload, signal].filter(value => value !== undefined));

    return Promise.resolve(resolveResult(method, payload));
  }) as MockApiFunction;

  Object.defineProperties(fn, {
    _isMockFunction: { value: true },
    mock: { value: { calls: [] } },
    calls: {
      get() {
        return fn.mock.calls;
      }
    }
  });

  fn.mockClear = () => {
    fn.mock.calls.length = 0;
  };
  fn.mockReset = fn.mockClear;
  fn.getMockName = () => method;

  return fn;
};
