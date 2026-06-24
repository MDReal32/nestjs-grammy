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
import type { Api, Context as GrammyContext, MiddlewareFn } from "grammy";

import type { BotInstanceOptions } from "@mdreal/nestjs-grammy";

import type { TestBotInfoOptions } from "./test-bot-info-options";

export interface GrammyTestingBotOptions<TContext extends GrammyContext = GrammyContext> {
  readonly botName?: string;
  readonly token?: string;
  readonly botInfo?: TestBotInfoOptions;
  readonly registerBot?: boolean;
  readonly options?: Omit<BotInstanceOptions<TContext>, "name" | "token" | "mode" | "apiPlugins" | "middlewares"> & {
    readonly apiPlugins?: readonly ((api: Api) => void)[];
    readonly middlewares?: readonly MiddlewareFn<TContext>[];
  };
}
