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
import type { Context as GrammyContext } from "grammy";

import type { GrammyBotTester } from "../tester";

/**
 * `GrammyTestingRegistry`
 *
 * Provides the `GrammyTestingRegistry` registry implementation.
 */
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
