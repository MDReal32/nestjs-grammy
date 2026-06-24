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

import { TG_BOT, TelegramModule } from "@mdreal/nestjs-grammy";
import type { DynamicModule, Provider } from "@nestjs/common";
import { Module } from "@nestjs/common";

import { createMockApi, createMockApiTransformer } from "../mock-api";
import { GrammyTestingRegistry } from "../registry";
import { GrammyBotTester, createContextCaptureMiddleware, createTestingBotState } from "../tester";
import { getGrammyBotTesterToken } from "../testing-tokens";
import type { GrammyTestingBotOptions, GrammyTestingModuleOptions } from "../types";
import { createTestBotInfo } from "../update-factory";

interface NormalizedBotOptions<TContext extends GrammyContext = GrammyContext> extends Required<
  Pick<GrammyTestingBotOptions<TContext>, "botName" | "token" | "registerBot">
> {
  readonly botInfo: NonNullable<GrammyTestingBotOptions<TContext>["botInfo"]>;
  readonly options: NonNullable<GrammyTestingBotOptions<TContext>["options"]>;
}

/**
 * `normalizeBots`
 *
 * Implements the normalize bots helper.
 * @param options - Optional configuration for the operation.
 * @returns Returns the computed result.
 */
const normalizeBots = <TContext extends GrammyContext>(
  options: GrammyTestingModuleOptions<TContext>
): NormalizedBotOptions<TContext>[] => {
  const bots = options.bots ?? [
    {
      botName: options.botName,
      token: options.token,
      botInfo: options.botInfo,
      registerBot: options.registerBot,
      options: options.options
    }
  ];

  return bots.map(bot => ({
    botName: bot.botName ?? "default",
    token: bot.token ?? "test-token",
    botInfo: bot.botInfo ?? {},
    registerBot: bot.registerBot ?? true,
    options: bot.options ?? {}
  }));
};

/**
 * `GrammyTestingModule`
 *
 * Provides the `GrammyTestingModule` NestJS module.
 */
@Module({})
export class GrammyTestingModule {
  static forRoot<TContext extends GrammyContext = GrammyContext>(
    options: GrammyTestingModuleOptions<TContext> = {}
  ): DynamicModule {
    const bots = normalizeBots(options);
    const imports = [...(options.imports ?? [])];
    const testerProviders: Provider[] = [];
    const testerTokens: string[] = [];

    for (const bot of bots) {
      const state = createTestingBotState<TContext>();
      const botInfo = createTestBotInfo(bot.botInfo);
      const mockApi = createMockApi(botInfo);
      const apiPlugins = bot.options.apiPlugins ?? [];
      const middlewares = bot.options.middlewares ?? [];
      const testerToken = getGrammyBotTesterToken(bot.botName);

      testerTokens.push(testerToken);

      if (bot.registerBot) {
        imports.push(
          TelegramModule.forRoot<TContext>({
            ...bot.options,
            name: bot.botName,
            token: bot.token,
            mode: "webhook",
            apiPlugins: [api => api.config.use(createMockApiTransformer(mockApi)), ...apiPlugins],
            middlewares: [createContextCaptureMiddleware(state), ...middlewares],
            onError: error => {
              state.errors.push(error);
              throw error instanceof Error ? error : new Error("nestjs-grammy-testing: handler failed");
            }
          })
        );
      }

      testerProviders.push({
        provide: testerToken,
        inject: [TG_BOT(bot.botName)],
        useFactory: (registeredBot: Bot<TContext>) => {
          if (!bot.registerBot) {
            registeredBot.api.config.use(createMockApiTransformer(mockApi));
            registeredBot.use(createContextCaptureMiddleware(state));
          }

          return new GrammyBotTester(bot.botName, registeredBot, mockApi, state, bot.botInfo);
        }
      });
    }

    const defaultToken = testerTokens[0] ?? getGrammyBotTesterToken("default");

    return {
      module: GrammyTestingModule,
      imports,
      providers: [
        ...testerProviders,
        {
          provide: GrammyTestingRegistry,
          inject: testerTokens,
          useFactory: (...testers: GrammyBotTester<TContext>[]) => new GrammyTestingRegistry(testers)
        },
        {
          provide: GrammyBotTester,
          useExisting: defaultToken
        }
      ],
      exports: [GrammyBotTester, GrammyTestingRegistry, ...testerTokens]
    };
  }
}
