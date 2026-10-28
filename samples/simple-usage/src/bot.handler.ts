import type { Context } from "grammy";
import { InlineKeyboard } from "grammy/keyboard";

import { KeyboardCallback, Start } from "@mdreal/nestjs-grammy";
import { Injectable } from "@nestjs/common";

@Injectable()
export class BotHandler {
  @Start({ description: "Any description", isHidden: false })
  async start(ctx: Context) {
    const kb = new InlineKeyboard();
    kb.text("Click me!", "click");
    await ctx.send({ text: "Welcome to the bot! Click the button below.", reply_markup: kb });
  }

  @KeyboardCallback("click")
  async onClick(ctx: Context) {
    await ctx.answerCallbackQuery({ text: "You were curious, indeed!" });
    const data = ctx.callbackQuery?.data;
    console.log(data);
  }
}
