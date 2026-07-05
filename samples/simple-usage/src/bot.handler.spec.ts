import { GrammyBotTester, GrammyTestingModule } from "@mdreal/nestjs-grammy-testing";
// Loads the ambient `jest.Matchers` augmentation for this shared spec file.
// It has no runtime effect and doesn't prevent this file from also running
// under vitest/bun/node:test, each of which augments its own matcher type.
import type {} from "@mdreal/nestjs-grammy-testing/jest";
import { Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";

import { BotHandler } from "./bot.handler";

@Module({ providers: [BotHandler] })
class BotHandlerModule {}

describe("BotHandler", () => {
  it("replies to /start with a welcome message and an inline keyboard", async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        GrammyTestingModule.forRoot({
          imports: [BotHandlerModule],
          botName: "default",
          token: "test-token"
        })
      ]
    }).compile();

    await moduleRef.init();

    const tester = moduleRef.get(GrammyBotTester);
    await tester.sendCommand("start");

    expect(tester).toHaveHandledCommand("start");
    expect(tester).toHaveSentInlineKeyboard();

    await moduleRef.close();
  });

  it("answers the callback query when the button is clicked", async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        GrammyTestingModule.forRoot({
          imports: [BotHandlerModule],
          botName: "default",
          token: "test-token"
        })
      ]
    }).compile();

    await moduleRef.init();

    const tester = moduleRef.get(GrammyBotTester);
    await tester.sendCallbackQuery("click");

    expect(tester).toHaveHandledCallbackQuery("click");
    expect(tester).toHaveAnsweredCallbackQueryWithText("You were curious, indeed!");

    await moduleRef.close();
  });
});
