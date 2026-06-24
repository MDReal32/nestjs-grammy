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
import type { Update } from "grammy/types";

import type { MockTelegramApi } from "../mock-api";
import type {
  CallbackQueryUpdateOptions,
  CommandUpdateOptions,
  MessageUpdateOptions,
  SendUpdateResult,
  TestBotInfoOptions,
  TestingBotState
} from "../types";
import {
  createCallbackQueryUpdate,
  createCommandUpdate,
  createMessageUpdate,
  createTestBotInfo
} from "../update-factory";
import { collectUpdateEvents } from "./collect-update-events";

/**
 * `GrammyBotTester`
 *
 * Provides the `GrammyBotTester` testing utility.
 */
export class GrammyBotTester<TContext extends GrammyContext = GrammyContext> {
  constructor(
    readonly botName: string,
    private readonly bot: Bot<TContext>,
    readonly api: MockTelegramApi,
    private readonly state: TestingBotState<TContext>,
    botInfo: TestBotInfoOptions = {}
  ) {
    if (!bot.isInited()) {
      bot.botInfo = createTestBotInfo(botInfo);
    }
  }

  get lastContext() {
    return this.state.lastContext;
  }

  get lastUpdate() {
    return this.state.lastUpdate;
  }

  get errors() {
    return this.state.errors;
  }

  get events() {
    return this.state.events;
  }

  clear() {
    this.api.clear();
    this.state.lastContext = undefined;
    this.state.lastUpdate = undefined;
    this.state.events.length = 0;
    this.state.errors.length = 0;
  }

  async sendUpdate(update: Update): Promise<SendUpdateResult<TContext>> {
    this.state.lastUpdate = update;
    this.state.events.push(...collectUpdateEvents(update));
    await this.bot.handleUpdate(update);

    return {
      update,
      context: this.state.lastContext,
      api: this.api
    };
  }

  sendMessage(text: string, options: Omit<MessageUpdateOptions, "text"> = {}) {
    return this.sendUpdate(
      createMessageUpdate({
        ...options,
        text
      })
    );
  }

  sendCommand(command: string, options: Omit<CommandUpdateOptions, "command"> = {}) {
    return this.sendUpdate(
      createCommandUpdate({
        ...options,
        command
      })
    );
  }

  sendCallbackQuery(data: string, options: Omit<CallbackQueryUpdateOptions, "data"> = {}) {
    return this.sendUpdate(
      createCallbackQueryUpdate({
        ...options,
        data
      })
    );
  }
}
