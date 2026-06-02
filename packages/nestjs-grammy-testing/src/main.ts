import "reflect-metadata";

import { registerGrammyMatchers } from "./matchers";
import "./matchers/jest-matchers";

export { grammyMatchers, registerGrammyMatchers } from "./matchers";
export { createMockApi, createMockApiTransformer } from "./mock-api";
export type { MockApiCall, MockApiFunction, MockTelegramApi } from "./mock-api";
export { GrammyTestingModule } from "./module";
export { GrammyTestingRegistry } from "./registry";
export { getGrammyBotTesterToken } from "./testing-tokens";
export { createContextCaptureMiddleware, createGrammyTester, GrammyBotTester, GrammyTesting } from "./tester";
export {
  createCallbackQueryUpdate,
  createCommandUpdate,
  createMessageUpdate,
  createTestBotInfo,
  createTestChat,
  createTestUser
} from "./update-factory";
export type {
  CallbackQueryUpdateOptions,
  CommandUpdateOptions,
  GrammyMatcherAssertions,
  GrammyTestingAttachOptions,
  GrammyTestingBotOptions,
  GrammyTestingModuleOptions,
  MatcherFunction,
  MatcherResult,
  MessageUpdateOptions,
  NestCompiledModule,
  NestTestingImport,
  SendUpdateResult,
  SentMessageMatchingOptions,
  TestBotInfoOptions,
  TestChatOptions,
  TestingBotState,
  TestUserOptions,
  TextMatcher
} from "./types";

registerGrammyMatchers();
