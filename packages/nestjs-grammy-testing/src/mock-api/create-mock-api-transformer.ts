import type { RawApi, Transformer } from "grammy";
import type { ApiResponse } from "grammy/types";

import type { MockTelegramApi } from "./mock-telegram-api";

export const createMockApiTransformer = (mockApi: MockTelegramApi): Transformer<RawApi> => {
  return async (_prev, method, payload, signal) => {
    const result = await mockApi.invoke(method, payload, signal);

    return {
      ok: true,
      result
    } as ApiResponse<never>;
  };
};
