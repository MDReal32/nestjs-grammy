import type { TestBotInfoOptions } from "./test-bot-info-options";

export interface GrammyTestingAttachOptions {
  readonly botName?: string;
  readonly botInfo?: TestBotInfoOptions;
  readonly init?: boolean;
}
