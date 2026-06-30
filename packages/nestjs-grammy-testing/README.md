# @mdreal/nestjs-grammy-testing

Testing utilities for applications built with `@mdreal/nestjs-grammy`.

This package is a thin test layer over:

- `@nestjs/testing`
- NestJS dependency injection
- the real `@mdreal/nestjs-grammy` registration/discovery flow
- grammY `Update`, `Context`, middleware, and `Bot#handleUpdate`

It is not a fake Telegram framework. It helps tests send Telegram-style updates into the same grammY bot pipeline that the runtime package registers.

## Installation

```bash
pnpm add -D @mdreal/nestjs-grammy-testing @nestjs/testing
```

Required peers:

```bash
pnpm add @mdreal/nestjs-grammy grammy @nestjs/common @nestjs/core reflect-metadata
```

## Usage modes

This package supports two testing modes.

- Use `GrammyTestingModule.forRoot()` for isolated handler/module tests.
- Use `GrammyTesting.create(moduleRef, options)` for real application tests that import `AppModule` normally.

## Mode 1: isolated command test

Use this mode when you only want to test bot handlers or feature modules. Call `moduleRef.init()` before sending updates. Nest lifecycle hooks are what bind decorators to the grammY bot.

```ts
import type { Context } from "grammy";

import { Command } from "@mdreal/nestjs-grammy";
import { GrammyBotTester, GrammyTestingModule } from "@mdreal/nestjs-grammy-testing";
import { Injectable, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";

@Injectable()
class BotHandlers {
  @Command("start")
  async onStart(ctx: Context) {
    await ctx.reply("Hello");
  }
}

@Module({ providers: [BotHandlers] })
class BotHandlersModule {}

it("handles /start", async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [
      GrammyTestingModule.forRoot({
        imports: [BotHandlersModule],
        botName: "default",
        token: "test-token"
      })
    ]
  }).compile();

  await moduleRef.init();

  const tester = moduleRef.get(GrammyBotTester);
  await tester.sendCommand("start");

  expect(tester).toHaveHandledCommand("start");
  expect(tester).toHaveRepliedWithText("Hello");

  await moduleRef.close();
});
```

## Message handler test

```ts
import { Hears } from "@mdreal/nestjs-grammy";

@Injectable()
class BotHandlers {
  @Hears("ping")
  async onPing(ctx: Context) {
    await ctx.reply("pong");
  }
}

await tester.sendMessage("ping");

expect(tester).toHaveHandledMessage("ping");
expect(tester).toHaveRepliedWithText("pong");
```

## Callback query test

```ts
import { KeyboardCallback } from "@mdreal/nestjs-grammy";

@Injectable()
class BotHandlers {
  @KeyboardCallback("confirm")
  async onConfirm(ctx: Context) {
    await ctx.answerCallbackQuery("confirmed");
  }
}

await tester.sendCallbackQuery("confirm");

expect(tester).toHaveHandledCallbackQuery("confirm");
expect(tester).toHaveAnsweredCallbackQueryWithText("confirmed");
```

## Testing with injected services

Handlers are normal Nest providers, so constructor injection works through the normal `TestingModule`.

```ts
@Injectable()
class GreetingService {
  getGreeting() {
    return "Hello from DI";
  }
}

@Injectable()
class BotHandlers {
  constructor(private readonly greeting: GreetingService) {}

  @Command("start")
  async onStart(ctx: Context) {
    await ctx.reply(this.greeting.getGreeting());
  }
}
```

## Overriding providers

Use standard `@nestjs/testing` overrides.

```ts
const moduleRef = await Test.createTestingModule({
  imports: [GrammyTestingModule.forRoot({ imports: [BotHandlersModule] })]
})
  .overrideProvider(GreetingService)
  .useValue({ getGreeting: () => "Overridden" })
  .compile();

await moduleRef.init();
const tester = moduleRef.get(GrammyBotTester);
await tester.sendCommand("start");

expect(tester).toHaveSentMessageWithText("Overridden");
```

## Raw update testing

Use `sendUpdate` when a helper factory is not enough.

```ts
import { createMessageUpdate } from "@mdreal/nestjs-grammy-testing";

await tester.sendUpdate(
  createMessageUpdate({
    updateId: 123,
    text: "ping",
    user: { id: 10, username: "alice" },
    chat: { id: 10 }
  })
);
```

## Multi-bot testing

Register multiple testing bots and retrieve a named tester.

```ts
import { GrammyBotTester, getGrammyBotTesterToken } from "@mdreal/nestjs-grammy-testing";

const moduleRef = await Test.createTestingModule({
  imports: [
    GrammyTestingModule.forRoot({
      imports: [BotHandlersModule],
      bots: [{ botName: "default" }, { botName: "admin" }]
    })
  ]
}).compile();

await moduleRef.init();

const adminTester = moduleRef.get<GrammyBotTester>(getGrammyBotTesterToken("admin"));
await adminTester.sendCommand("start");
```

## Mode 2: attach to an existing app module

Use this mode for real application tests. Import `AppModule` normally, apply any provider overrides before `compile()`, then create a tester from the compiled module.

`GrammyTesting.create()` finds the registered grammY bot by name, installs API recording, attaches context capture, initializes the module if needed, and sends updates through the real bot pipeline.

```ts
import { GrammyTesting } from "@mdreal/nestjs-grammy-testing";
import { Test } from "@nestjs/testing";

it("handles /start through AppModule", async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule]
  })
    .overrideProvider(GreetingService)
    .useValue({ getGreeting: () => "Welcome" })
    .compile();

  const tester = await GrammyTesting.create(moduleRef, {
    botName: "default"
  });

  await tester.sendCommand("/start");

  expect(tester).toHaveHandledCommand("start");
  expect(tester).toHaveSentMessageWithText(/welcome/i);

  await moduleRef.close();
});
```

For multiple bots, pass the target `botName`.

```ts
const adminTester = await GrammyTesting.create(moduleRef, {
  botName: "admin"
});
```

## Test runner integration

The matchers are test-runner neutral — they only need an `expect.extend(...)`-compatible object. Import the entry point for your runner **once** from a setup file. It registers the matchers and augments that runner's matcher types automatically — no manual `registerGrammyMatchers` call or `declare module` block needed.

| Runner                     | Import                                               | Where to put it                      |
| -------------------------- | ---------------------------------------------------- | ------------------------------------ |
| Jest                       | `import "@mdreal/nestjs-grammy-testing/jest";`       | `setupFilesAfterEach`                |
| Vitest                     | `import "@mdreal/nestjs-grammy-testing/vitest";`     | `test.setupFiles`                    |
| Bun                        | `import "@mdreal/nestjs-grammy-testing/bun";`        | `bunfig.toml` → `preload`            |
| Playwright Test            | `import "@mdreal/nestjs-grammy-testing/playwright";` | a setup / fixture file               |
| node:test, Mocha, or other | `import "@mdreal/nestjs-grammy-testing/expect";`     | requires the standalone `expect` pkg |

Example (Vitest):

```ts
// vitest.setup.ts
import "@mdreal/nestjs-grammy-testing/vitest";
```

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { setupFiles: ["./vitest.setup.ts"] }
});
```

Each entry also re-exports `registerGrammyMatchers`, `grammyMatchers`, and the
`GrammyMatcherAssertions` type if you need to wire things up manually. For a runner not
listed above, use the `/expect` entry (it drives the standalone [`expect`](https://www.npmjs.com/package/expect) package, which most runners can adopt).

## Semantic assertions

Assertions should describe bot behavior instead of raw Bot API internals.

```ts
await tester.sendCommand("start");

expect(tester).toHaveHandledCommand("start");
expect(tester).toHaveSentMessageWithText(/hello/i);
expect(tester).toHaveSentMessageToChat(123);
expect(tester).toHaveSentInlineKeyboard();
```

Useful matcher groups include:

- handled updates: `toHaveHandledUpdate`, `toHaveHandledCommand`, `toHaveHandledMessage`, `toHaveHandledCallbackQuery`, `toHaveHandledEvent`
- event counts: `toHaveEvent`, `toHaveEventCount`
- messages: `toHaveSentMessage`, `toHaveSentMessageWithText`, `toHaveSentMessageToChat`, `toHaveSentMessageMatching`, `toHaveSentMessagesCount`
- replies: `toHaveReplied`, `toHaveRepliedWithText`, `toHaveRepliedToMessage`
- edits: `toHaveEditedMessage`, `toHaveEditedMessageText`, `toHaveEditedMessageReplyMarkup`, `toHaveEditedMessageCaption`
- callback queries: `toHaveAnsweredCallbackQuery`, `toHaveAnsweredCallbackQueryWithText`, `toHaveAnsweredCallbackQueryWithAlert`, `toHaveAnsweredCallbackQueryWithoutAlert`
- keyboards: `toHaveSentInlineKeyboard`, `toHaveSentReplyKeyboard`, `toHaveRemovedKeyboard`, `toHaveSentButtonWithText`, `toHaveSentButtonWithCallbackData`
- media: `toHaveSentPhoto`, `toHaveSentPhotoWithCaption`, `toHaveSentDocument`, `toHaveSentVideo`, `toHaveSentAudio`, `toHaveSentVoice`, `toHaveSentMediaGroup`
- chat actions and moderation: `toHaveSentChatAction`, `toHaveSentTypingAction`, `toHaveDeletedMessage`, `toHavePinnedMessage`, `toHaveUnpinnedMessage`

Generic fallback matchers are available when no semantic matcher exists yet:

```ts
expect(tester).toHaveCalledTelegramApi("sendInvoice");
expect(tester).toHaveCalledTelegramApiWith("sendInvoice", { title: /pro/i });
```

Raw API call records remain available on `tester.api` for advanced debugging, but README examples intentionally avoid asserting against them.

## Context inspection

The tester captures the last grammY context before handlers run.

```ts
await tester.sendMessage("hello", { user: { id: 99 } });

expect(tester).toHaveHandledMessage("hello");
expect(tester.lastContext?.from?.id).toBe(99);
```

## Limitations

- You must call `await moduleRef.init()` before sending updates so Nest lifecycle hooks bind handlers.
- Factories generate minimal valid-enough Telegram updates, not exhaustive Telegram API fixtures.
- Mock API return values are basic defaults. Prefer semantic matchers over simulated Telegram responses.
- Webhook server behavior is not simulated; updates are sent directly through grammY `bot.handleUpdate`.
- Conversation/session plugins can be tested if your app configures them, but this package does not add plugin-specific fixtures yet.
