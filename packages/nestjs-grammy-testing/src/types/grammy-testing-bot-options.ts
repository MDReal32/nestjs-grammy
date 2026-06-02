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
