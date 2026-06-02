import type { Context as GrammyContext } from "grammy";

import type { GrammyBotTester } from "../tester";

export class GrammyTestingRegistry<TContext extends GrammyContext = GrammyContext> {
  private readonly testers = new Map<string, GrammyBotTester<TContext>>();

  constructor(entries: readonly GrammyBotTester<TContext>[]) {
    for (const tester of entries) {
      this.testers.set(tester.botName, tester);
    }
  }

  get(botName = "default") {
    const tester = this.testers.get(botName);

    if (!tester) {
      throw new Error(`nestjs-grammy-testing: tester for bot "${botName}" was not registered`);
    }

    return tester;
  }

  names() {
    return Array.from(this.testers.keys());
  }
}
