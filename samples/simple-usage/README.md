# simple-usage

A minimal example showing how to build a Telegram bot with [`@mdreal/nestjs-grammy`](../../packages/nestjs-grammy).

It registers a single bot via `TelegramModule.forRoot()` and wires up two handlers:

- `@Start()` — replies with a welcome message and an inline keyboard
- `@KeyboardCallback("click")` — answers the callback when the button is pressed

See [`src/bot.handler.ts`](src/bot.handler.ts) and [`src/app.module.ts`](src/app.module.ts).

## Prerequisites

- Node.js >= 22
- A Telegram bot token from [@BotFather](https://t.me/BotFather)

## Setup

Install dependencies from the repository root (this is a workspace):

```bash
yarn install
```

Provide your bot token via the `TELEGRAM_BOT_TOKEN` environment variable:

```bash
export TELEGRAM_BOT_TOKEN="123456:your-bot-token"
```

## Run

```bash
# development (watch mode)
yarn start:dev

# production
yarn build
yarn start:prod
```

The app starts an HTTP server on `PORT` (default `3000`) and runs the bot in `auto` mode
(polling or webhook, chosen automatically). Open a chat with your bot and send `/start`.

## Configuration

The bot is configured in [`src/app.module.ts`](src/app.module.ts):

```ts
TelegramModule.forRoot({
  name: "mybot",
  token: process.env.TELEGRAM_BOT_TOKEN ?? "",
  mode: "auto", // "auto" | "polling" | "webhook"
  logging: true // use the NestJS logger
});
```

For the full API (decorators, multiple bots, dependency injection, conversations),
see the [`@mdreal/nestjs-grammy` documentation](../../packages/nestjs-grammy/README.md).
