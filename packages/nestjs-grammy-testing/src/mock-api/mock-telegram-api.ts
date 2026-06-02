import type { MockApiCall } from "./mock-api-call";
import type { MockApiFunction } from "./mock-api-function";

export interface MockTelegramApi {
  readonly calls: MockApiCall[];
  readonly sendMessage: MockApiFunction;
  readonly editMessageText: MockApiFunction;
  readonly answerCallbackQuery: MockApiFunction;
  readonly getMe: MockApiFunction;
  clear(): void;
  callsFor(method: string): MockApiCall[];
  invoke(method: string, payload: unknown, signal?: unknown): Promise<unknown>;
  [method: string]: unknown;
}
