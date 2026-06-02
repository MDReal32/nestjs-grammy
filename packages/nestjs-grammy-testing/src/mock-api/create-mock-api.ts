import type { UserFromGetMe } from "grammy/types";

import { createTestBotInfo } from "../update-factory";
import { createDefaultResult } from "./create-default-result";
import { createMockFunction } from "./create-mock-function";
import type { MockApiCall } from "./mock-api-call";
import type { MockApiFunction } from "./mock-api-function";
import type { MockTelegramApi } from "./mock-telegram-api";

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
