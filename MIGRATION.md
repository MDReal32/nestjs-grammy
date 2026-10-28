# Migrating to `@mdreal/nestjs-grammy@next` (grammY 2.0)

The `next` dist-tag (`2.0.0-next.*`) moves `@mdreal/nestjs-grammy` and `@mdreal/nestjs-grammy-testing` from grammY 1.x
to grammY 2.0. grammY 2.0 is still in beta, so treat this line as a preview.

This guide covers what changes for apps using these packages. For grammY's own API changes, also read the upstream
[grammY v1 → v2 migration notes](https://github.com/grammyjs/website/blob/docs/v2-migration-list/site/docs/guide/v2-migration.md).

## Contents

- [Requirements](#requirements)
- [1. Install grammY 2.0 from JSR](#1-install-grammy-20-from-jsr)
- [2. Update your handlers](#2-update-your-handlers)
- [3. Review module options](#3-review-module-options)
- [4. Polling behaviour](#4-polling-behaviour)
- [5. Tests](#5-tests)
- [Known limitations](#known-limitations)
- [Checklist](#checklist)

## Requirements

| Requirement | 1.x                | `next`                                                                      |
| ----------- | ------------------ | --------------------------------------------------------------------------- |
| grammY      | `^1` from npm      | `2.0.0-beta.8` from JSR (`npm:@jsr/grammyjs__grammy@2.0.0-beta.8`)          |
| Node.js     | `>=22`             | `>=22`; CommonJS apps need `>=22.12` (or `>=20.19`) to `require` ESM grammY |
| Module type | CommonJS or ESM    | CommonJS or ESM; grammY itself is **ESM only**                              |
| NestJS      | `^10 \|\| ^11`     | unchanged                                                                   |
| Runner      | `@grammyjs/runner` | removed; grammY's built-in `bot.start()` is used                            |

## 1. Install grammY 2.0 from JSR

grammY 2.0 is published only on [JSR](https://jsr.io/@grammyjs/grammy). Point the `@jsr` scope at JSR's npm registry:

```ini
# .npmrc (npm, pnpm, bun)
@jsr:registry=https://npm.jsr.io
```

```yaml
# .yarnrc.yml (yarn berry)
npmScopes:
  jsr:
    npmRegistryServer: "https://npm.jsr.io"
```

Then install the preview, aliasing `grammy` to the same JSR build the library uses:

```bash
# npm
npm install @mdreal/nestjs-grammy@next grammy@npm:@jsr/grammyjs__grammy@2.0.0-beta.8
npm install -D @mdreal/nestjs-grammy-testing@next

# yarn
yarn add @mdreal/nestjs-grammy@next grammy@npm:@jsr/grammyjs__grammy@2.0.0-beta.8
yarn add -D @mdreal/nestjs-grammy-testing@next

# pnpm
pnpm add @mdreal/nestjs-grammy@next grammy@npm:@jsr/grammyjs__grammy@2.0.0-beta.8
pnpm add -D @mdreal/nestjs-grammy-testing@next

# bun
bun add @mdreal/nestjs-grammy@next grammy@npm:@jsr/grammyjs__grammy@2.0.0-beta.8
bun add -D @mdreal/nestjs-grammy-testing@next
```

Keeping the alias name `grammy` matters: `import { Context } from "grammy"` in your app must resolve to the **same**
grammY copy as the library, or types and `instanceof` checks will not line up. If you used `@grammyjs/runner` only
because of this library, you can uninstall it.

## 2. Update your handlers

Most of the work is grammY's own API changes. The ones you are most likely to hit:

| grammY 1.x                                    | grammY 2.0                                                             |
| --------------------------------------------- | ---------------------------------------------------------------------- |
| `ctx.reply("hi")`                             | `ctx.send("hi")`                                                       |
| `ctx.reply("hi", { reply_markup })`           | `ctx.send({ text: "hi", reply_markup })`                               |
| `import { InlineKeyboard } from "grammy"`     | `import { InlineKeyboard } from "grammy/keyboard"`                     |
| `bot.botInfo`                                 | `bot.me`                                                               |
| `api.config.use(transformer)`                 | `api.transform(transformer)`                                           |
| transformer `(prev, method, payload, signal)` | transformer `(prev, data, signal)` with `data.method` / `data.payload` |
| `webhookCallback(bot, "http")`                | `webhookAdapters.http(bot)` from `"grammy/webhook"`                    |
| `Chat.PrivateChat`                            | `Chat.Private`                                                         |
| `Message.TextMessage`                         | `Message & { text: string }`                                           |

Before:

```ts
import { type Context, InlineKeyboard } from "grammy";

@Start()
async onStart(ctx: Context) {
  const kb = new InlineKeyboard().text("Click me", "clicked");
  await ctx.reply("Welcome!", { reply_markup: kb });
}
```

After:

```ts
import type { Context } from "grammy";
import { InlineKeyboard } from "grammy/keyboard";

@Start()
async onStart(ctx: Context) {
  const kb = new InlineKeyboard().text("Click me", "clicked");
  await ctx.send({ text: "Welcome!", reply_markup: kb });
}
```

The decorators (`@Command`, `@Start`, `@Help`, `@Hears`, `@On`, `@Use`, `@KeyboardCallback`, `@Conversation`), scopes and
injection helpers (`@InjectBot`, `@InjectApi`, `@InjectWebhook`, `@InjectOptions`) keep the same API. `@InjectBot()` and
`@InjectApi()` now give you grammY 2.0 `Bot` / `Api` instances, so code that calls them directly needs the same updates
as the table above.

## 3. Review module options

`TelegramModule.forRoot()` / `forRootAsync()` accept the same options. Two behave differently:

### `apiPlugins`

In grammY 2.0 every update gets a **fresh `ctx.api`** that does not inherit transformers installed on `bot.api`. To keep
plugins working inside handlers, the library now applies each `apiPlugins` entry to `bot.api` once at startup **and** to
`ctx.api` on every update.

Write plugins for the new API, and keep them cheap and free of one-time side effects, since they now run per update:

```ts
TelegramModule.forRoot({
  name: "mybot",
  token: process.env.TELEGRAM_TOKEN!,
  // 1.x: apiPlugins: [api => api.config.use(autoRetry())]
  apiPlugins: [api => api.transform(autoRetry())]
});
```

API plugins that still target grammY 1.x (`api.config.use`) need a grammY 2.0 compatible release.

### `polling`

`polling` is now passed to grammY's `bot.start()` and takes grammY 2.0's `PollingOptions` (`limit`, `timeout`,
`allowed_updates`, `drop_pending_updates`, `onStart`, `onStop`). Under 1.x these options were not forwarded to
`@grammyjs/runner`, so values you set before now take effect. `polling.onStart(me)` runs before the module's own
`onStart` callback.

```ts
TelegramModule.forRoot({
  name: "mybot",
  token: process.env.TELEGRAM_TOKEN!,
  polling: {
    allowed_updates: ["message", "callback_query"],
    drop_pending_updates: true
  }
});
```

Webhook options are unchanged; the HTTP handler behind `@InjectWebhook()` is now built with `webhookAdapters.http(bot)`.

## 4. Polling behaviour

1.x polled with `@grammyjs/runner`, which processed updates **concurrently** and serialized them per chat/user with
`sequentialize`. `@grammyjs/runner` has no grammY 2.0 release, so `next` uses grammY's built-in `bot.start()`, which
processes updates **one at a time**.

What this means for you:

- Ordering is stricter: no two updates are handled at once, across all chats.
- A slow handler delays every other update. Move long work (HTTP calls, uploads, heavy DB queries) off the update path,
  for example into a queue, or switch the bot to webhook mode.
- Startup errors from polling (for example an invalid token) go to the `onError` option if set, otherwise they are
  logged.

## 5. Tests

`@mdreal/nestjs-grammy-testing@next` keeps the same API: `GrammyTestingModule.forRoot()`, `GrammyTesting.create()`,
`GrammyBotTester`, update factories and matchers.

### Jest

grammY 2.0 is ESM only, which Jest's CommonJS loader cannot `require`. Let `ts-jest` compile grammY and its `@jsr`
dependencies:

```js
// jest.config.js
module.exports = {
  transform: {
    "/node_modules/.+\\.js$": ["ts-jest", { tsconfig: { allowJs: true, module: "commonjs", target: "es2022" } }],
    "^.+\\.ts$": "ts-jest"
  },
  transformIgnorePatterns: ["/node_modules/(?!(grammy|@jsr)/)"],
  setupFilesAfterEnv: ["@mdreal/nestjs-grammy-testing/jest"]
};
```

Vitest, Bun and `node:test` load ESM natively and need no change.

### Custom mock wiring

If you wired the mock API onto a bot yourself, install it on both `bot.api` and each update's `ctx.api`. Otherwise
handlers call the real Telegram API:

```ts
import { createMockApi, createMockApiMiddleware, createMockApiTransformer } from "@mdreal/nestjs-grammy-testing";

const mockApi = createMockApi(botInfo);
bot.api.transform(createMockApiTransformer(mockApi)); // 1.x: bot.api.config.use(...)
bot.use(createMockApiMiddleware(mockApi)); // new: covers ctx.api
```

`GrammyTestingModule` and `GrammyTesting.create()` do this for you.

### Fixtures

- `createTestBotInfo()` fills the new `supports_guest_queries` field (default `false`).
- Chat options and factories use `Chat.Private` instead of `Chat.PrivateChat`.
- Hand-written fixtures typed as grammY 1.x `UserFromGetMe`, `Chat.PrivateChat` or `Message.TextMessage` need the same
  updates as section 2.

## Known limitations

- `@Conversation()` has not been verified with grammY 2.0. `@grammyjs/conversations` still declares a grammY 1.x peer, so
  expect peer warnings and test conversation flows before relying on them.
- Polling and webhook mode have been tested through the testing package only, not yet against the real Telegram API.
- The `next` line follows grammY's beta and may change with later grammY 2.0 betas.

## Checklist

- [ ] Add the `@jsr` registry to `.npmrc` / `.yarnrc.yml`
- [ ] Install `@mdreal/nestjs-grammy@next`, `@mdreal/nestjs-grammy-testing@next` and `grammy@npm:@jsr/grammyjs__grammy@2.0.0-beta.8`
- [ ] Remove `@grammyjs/runner` if nothing else uses it
- [ ] Replace `ctx.reply` with `ctx.send`, and move `reply_markup` and similar options into the object form
- [ ] Import keyboards from `grammy/keyboard`
- [ ] Update `apiPlugins` to `api.transform(...)` and make them safe to run per update
- [ ] Check `polling` options, which now take effect
- [ ] Move slow work off the update path (polling is sequential)
- [ ] Update Jest config for ESM-only grammY
- [ ] Use Node `>=22.12` if your app is CommonJS
- [ ] Test `@Conversation()` flows
