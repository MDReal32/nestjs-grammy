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
import type { Bot, Context as GrammyContext } from "grammy";

import { TG_BOT } from "@mdreal/nestjs-grammy";

import { createMockApi, createMockApiTransformer } from "../mock-api";
import type { GrammyTestingAttachOptions, NestCompiledModule } from "../types";
import { createTestBotInfo } from "../update-factory";
import { GrammyBotTester } from "./bot-tester";
import { createContextCaptureMiddleware } from "./create-context-capture-middleware";
import { createTestingBotState } from "./create-testing-bot-state";

/**
 * `createGrammyTester`
 *
 * Creates the Grammy Tester value.
 * @param moduleRef - The module ref value.
 * @param options - Optional configuration for the operation.
 * @returns Returns the created value.
 */
export const createGrammyTester = async <TContext extends GrammyContext = GrammyContext>(
  moduleRef: NestCompiledModule,
  options: GrammyTestingAttachOptions = {}
) => {
  const botName = options.botName ?? "default";
  const bot = moduleRef.get<Bot<TContext>>(TG_BOT(botName), { strict: false });
  const state = createTestingBotState<TContext>();
  const botInfo = createTestBotInfo(options.botInfo);
  const mockApi = createMockApi(botInfo);

  if (!bot.isInited()) {
    bot.botInfo = botInfo;
  }

  bot.api.config.use(createMockApiTransformer(mockApi));
  bot.use(createContextCaptureMiddleware(state));

  if (options.init !== false) {
    await moduleRef.init?.();
  }

  return new GrammyBotTester(botName, bot, mockApi, state, options.botInfo);
};
