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
