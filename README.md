# @mdreal/nestjs-grammy

[![npm version](https://img.shields.io/npm/v/@mdreal/nestjs-grammy)](https://www.npmjs.com/package/@mdreal/nestjs-grammy)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](./LICENSE)
[![Downloads](https://img.shields.io/npm/dw/@mdreal/nestjs-grammy)](https://www.npmjs.com/package/@mdreal/nestjs-grammy)

> Build **Telegram bots** with **NestJS** ergonomics and **[grammY](https://grammy.dev/)** power — fully typed, decorator-driven, and test-ready.

`@mdreal/nestjs-grammy` wraps grammY in an idiomatic [NestJS](https://nestjs.com) module. Register bots as
dynamic modules, write handlers with decorators, and inject bot/API instances anywhere with normal DI. A
companion package, [`@mdreal/nestjs-grammy-testing`](packages/nestjs-grammy-testing), lets you test handlers
against a mock Telegram API — no network, no real token.

## Contents

- [Installation](#installation)
- [Quick start](#quick-start)
- [Features](#features)
- [Multiple bots](#multiple-bots)
- [Conversations](#conversations)
- [Dependency injection](#dependency-injection)
- [Configuration](#configuration)
- [Testing](#testing)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

## Installation

```bash
npm install @mdreal/nestjs-grammy
# peer dependencies (required in your app)
npm install @nestjs/common @nestjs/core reflect-metadata
```

> Any package manager works (npm, yarn, pnpm, bun) — swap `npm install` for your tool of choice.

### grammY 2.0 preview (`next`)

The `next` dist-tag tracks grammY 2.0, which is in beta and published **only on [JSR](https://jsr.io/@grammyjs/grammy)**. Point the `@jsr` scope at JSR's npm registry, then install the preview together with the same grammY build:

```ini
# .npmrc (npm, pnpm, bun)
@jsr:registry=https://npm.jsr.io
```

```yaml
# .yarnrc.yml (yarn)
npmScopes:
  jsr:
    npmRegistryServer: "https://npm.jsr.io"
```

```bash
npm install @mdreal/nestjs-grammy@next grammy@npm:@jsr/grammyjs__grammy@2.0.0-beta.8
```

Installing `grammy` under the same alias keeps a single grammY copy, so `import { Context } from "grammy"` in your app resolves to v2. Migrate your handlers with the [grammY v1 → v2 notes](https://github.com/grammyjs/website/blob/docs/v2-migration-list/site/docs/guide/v2-migration.md) (for example `ctx.reply` → `ctx.send`). Polling uses grammY's built-in `bot.start()` instead of `@grammyjs/runner`, and `@Conversation()` has not been verified against grammY 2.0 yet.

## Quick start

**1. Register a bot** with `TelegramModule.forRoot()`:

```ts
import { TelegramModule } from "@mdreal/nestjs-grammy";
import { Module } from "@nestjs/common";

import { BotHandlers } from "./bot.handlers";

@Module({
  imports: [
    TelegramModule.forRoot({
      name: "mybot",
      token: process.env.TELEGRAM_TOKEN!,
      mode: "auto", // "auto" | "polling" | "webhook"
      logging: true
    })
  ],
  providers: [BotHandlers]
})
export class AppModule {}
```

**2. Write handlers** as normal injectable providers:

```ts
import type { Context } from "grammy";

import { Command, Help, Start } from "@mdreal/nestjs-grammy";
import { Injectable } from "@nestjs/common";

@Injectable()
export class BotHandlers {
  @Start({ description: "Start the bot" })
  async onStart(ctx: Context) {
    await ctx.send("Welcome to the bot!");
  }

  @Help({ description: "Show help" })
  async onHelp(ctx: Context) {
    await ctx.send("Available commands: /start, /help");
  }

  @Command("secret", { description: "Admin only", isHidden: true })
  async onSecret(ctx: Context) {
    await ctx.send("Shh.");
  }
}
```

That's it. Non-hidden commands are automatically registered with Telegram via `setMyCommands()` at bootstrap.

## Features

- **Dynamic module** — register one or many bots with `TelegramModule.forRoot()` / `forRootAsync()`.
- **Multiple bots** — run any number of bots in one app, each isolated by name and `@Scope`.
- **Decorator-based handlers** — `@Command`, `@Start`, `@Help`, `@Hears`, `@On`, `@Use`, `@KeyboardCallback`, and `@Conversation`.
- **Dependency injection** — inject instances with `@InjectBot`, `@InjectApi`, `@InjectWebhook`, `@InjectOptions`.
- **Auto-wiring** — handlers are discovered and bound at bootstrap via Nest's `DiscoveryService`; no manual plumbing.
- **Flexible runtime** — per-bot polling or webhook mode, plus grammY plugins, custom middlewares, logging, and rate limiting.
- **First-class testing** — a dedicated package to unit-test handlers without the Telegram API.

## Multiple bots

Register several bots and use `@Scope` to bind a handler class to a specific one:

```ts
import type { Context } from "grammy";

import { Command, Scope } from "@mdreal/nestjs-grammy";
import { Injectable, Module } from "@nestjs/common";

@Module({
  imports: [
    TelegramModule.forRoot({ name: "alpha", token: process.env.TG_ALPHA! }),
    TelegramModule.forRoot({ name: "beta", token: process.env.TG_BETA! })
  ]
})
export class AppModule {}

@Injectable()
@Scope("beta") // binds only to the "beta" bot
export class BetaHandlers {
  @Command("ping")
  async onPing(ctx: Context) {
    await ctx.send("pong from beta bot");
  }
}
```

## Conversations

Conversational flows use the optional [`@grammyjs/conversations`](https://grammy.dev/plugins/conversations) peer
dependency:

```bash
npm install @grammyjs/conversations
```

Mark any method with `@Conversation()` — the module installs the `conversations()` middleware and registers the
handler with `createConversation()` automatically at bootstrap:

```ts
import type { Context } from "grammy";

import type { Conversation as Conv, ConversationFlavor } from "@grammyjs/conversations";
import { Conversation, Start } from "@mdreal/nestjs-grammy";
import { Injectable } from "@nestjs/common";

type MyContext = ConversationFlavor<Context>;

@Injectable()
export class BotHandlers {
  @Start()
  async onStart(ctx: MyContext) {
    await ctx.conversation.enter("collect");
  }

  @Conversation("collect")
  async collect(conversation: Conv<MyContext>, ctx: MyContext) {
    await ctx.send("What is your name?");
    const { message } = await conversation.waitFor("message:text");
    await ctx.send(`Hello, ${message.text}!`);
  }
}
```

Need persistent conversation storage or other plugin options? Pass them via the `conversations` module option —
they are forwarded straight to `conversations()`:

```ts
TelegramModule.forRoot({
  name: "mybot",
  token: process.env.TELEGRAM_TOKEN!,
  conversations: {
    storage: {
      /* e.g. a MongoDB / Redis storage adapter */
    }
  }
});
```

> The `@Conversation` name (e.g. `"collect"`) must match the string passed to `ctx.conversation.enter("collect")`.
> If no name is given, the method name is used.

## Dependency injection

```ts
import type { Api, Bot } from "grammy";

import { InjectApi, InjectBot } from "@mdreal/nestjs-grammy";
import { Injectable } from "@nestjs/common";

@Injectable()
export class BotService {
  constructor(
    @InjectBot("mybot") private readonly bot: Bot,
    @InjectApi("mybot") private readonly api: Api
  ) {}

  async notify(chatId: number, message: string) {
    await this.api.sendMessage(chatId, message);
  }
}
```

## Configuration

Every option accepted by `TelegramModule.forRoot()` (and the `useFactory` result of `forRootAsync()`):

```ts
TelegramModule.forRoot({
  name: "mybot", // unique bot name (required)
  token: "...", // BotFather token (required)
  mode: "auto", // "auto" | "polling" | "webhook"
  apiPlugins: [], // grammY API plugins (api => void)
  rateLimit: {}, // in-memory rate limiting
  middlewares: [], // custom grammY middlewares
  polling: {}, // grammY PollingOptions
  webhook: { url: "" }, // webhook options
  conversations: {}, // options forwarded to @grammyjs/conversations
  logging: true, // enable the NestJS logger
  onError: err => {}, // error boundary callback
  onStart: info => {} // called when the bot starts
});
```

Use `forRootAsync()` when options depend on other providers (e.g. `ConfigService`).

## Testing

Test handlers and conversations without touching the real Telegram API using
[`@mdreal/nestjs-grammy-testing`](packages/nestjs-grammy-testing): a mock Telegram API, a `GrammyTestingModule`
for isolated handler tests (or attaching to a real `AppModule`), and semantic matchers like
`toHaveHandledCommand` and `toHaveRepliedWithText`.

```bash
npm install -D @mdreal/nestjs-grammy-testing
```

Register the matchers once in your test-runner setup file. Each runner has its own entry — `vitest`, `jest`,
`bun`, `playwright`, or `expect` (for node:test and others):

```ts
// vitest.setup.ts (add to test.setupFiles) — or jest.setup.ts, bun, etc.
import "@mdreal/nestjs-grammy-testing/vitest";
```

Then write plain NestJS tests:

```ts
import { GrammyBotTester, GrammyTestingModule } from "@mdreal/nestjs-grammy-testing";
import { Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";

import { BotHandlers } from "./bot.handlers";

@Module({ providers: [BotHandlers] })
class BotHandlersModule {}

it("replies to /start", async () => {
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
  expect(tester).toHaveRepliedWithText("Welcome to the bot!");

  await moduleRef.close();
});
```

See the [testing package README](packages/nestjs-grammy-testing/README.md) for the full guide — multi-bot
testing, provider overrides, raw update factories, and per-runner setup.

## Roadmap

**Implemented**

- Core decorators (`@Command`, `@Start`, `@Help`, `@Hears`, `@On`, `@Use`, `@KeyboardCallback`) with auto-registered commands
- Multi-bot support with `@Scope` / `@Scopes`
- Injection helpers (`@InjectBot`, `@InjectApi`, `@InjectWebhook`, `@InjectOptions`)
- Auto-binding via `DiscoveryService`
- `@Conversation()` with configurable `conversations` options (storage, plugins, hooks)

**Planned**

- `@AdminOnly()` — restrict handlers to configured admin user IDs
- `@PrivateChat()` / `@GroupChat()` — run handlers only in specific chat types
- `@Throttle(ms)` — per-user throttling for spam control
- `@Alias("...")` — multiple triggers for one command
- `@Fallback()` — catch-all handler for unrecognized input
- Auto-generated `/help` that aggregates registered commands (today `@Help()` is only a handler shorthand for `@Command("help")`)
- CLI generator (`nest g handler`) and graceful shutdown hooks (a manual `stop()` exists; Nest-lifecycle integration is pending)

## Documentation & references

- [`@mdreal/nestjs-grammy` docs](packages/nestjs-grammy/README.md) — core module reference
- [`@mdreal/nestjs-grammy-testing` docs](packages/nestjs-grammy-testing/README.md) — testing guide
- [`samples/simple-usage`](samples/simple-usage) — minimal working example app
- [grammY documentation](https://grammy.dev/) — bot API & middleware
- [NestJS documentation](https://docs.nestjs.com/) — framework fundamentals

## Contributing

Contributions, issues, and feature requests are welcome. Please open an issue to discuss ideas before submitting
a PR.

## License

Licensed under the [Apache License 2.0](./LICENSE). Copyright © 2025 [MDReal](https://github.com/mdreal).
