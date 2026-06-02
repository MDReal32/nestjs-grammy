import type { Context as GrammyContext } from "grammy";

import type { GrammyTestingBotOptions } from "./grammy-testing-bot-options";
import type { NestTestingImport } from "./nest-testing-import";

export interface GrammyTestingModuleOptions<
  TContext extends GrammyContext = GrammyContext
> extends GrammyTestingBotOptions<TContext> {
  readonly imports?: readonly NestTestingImport[];
  readonly bots?: readonly GrammyTestingBotOptions<TContext>[];
}
