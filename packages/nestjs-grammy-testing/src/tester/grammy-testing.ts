import type { Context as GrammyContext } from "grammy";

import type { GrammyTestingAttachOptions, NestCompiledModule } from "../types";
import { createGrammyTester } from "./create-grammy-tester";

export class GrammyTesting {
  static create<TContext extends GrammyContext = GrammyContext>(
    moduleRef: NestCompiledModule,
    options: GrammyTestingAttachOptions = {}
  ) {
    return createGrammyTester<TContext>(moduleRef, options);
  }
}
