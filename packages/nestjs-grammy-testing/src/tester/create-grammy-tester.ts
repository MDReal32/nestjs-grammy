import type { Bot, Context as GrammyContext } from "grammy";

import { TG_BOT } from "@mdreal/nestjs-grammy";

import { createMockApi, createMockApiTransformer } from "../mock-api";
import type { GrammyTestingAttachOptions, NestCompiledModule } from "../types";
import { createTestBotInfo } from "../update-factory";
import { GrammyBotTester } from "./bot-tester";
import { createContextCaptureMiddleware } from "./create-context-capture-middleware";
import { createTestingBotState } from "./create-testing-bot-state";

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
