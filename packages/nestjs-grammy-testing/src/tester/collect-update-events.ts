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
import type { Update } from "grammy/types";

/**
 * `getMessageText`
 *
 * Gets the Message Text value.
 * @param update - The Telegram update to inspect.
 * @returns Returns the requested value.
 */
const getMessageText = (update: Update) => update.message?.text;

/**
 * `getCallbackQueryData`
 *
 * Gets the Callback Query Data value.
 * @param update - The Telegram update to inspect.
 * @returns Returns the requested value.
 */
const getCallbackQueryData = (update: Update) => update.callback_query?.data;

/**
 * `getCommand`
 *
 * Gets the Command value.
 * @param update - The Telegram update to inspect.
 * @returns Returns the requested value.
 */
const getCommand = (update: Update) => {
  const text = getMessageText(update);
  const entity = update.message?.entities?.find(item => item.type === "bot_command" && item.offset === 0);

  if (!text || !entity) {
    return undefined;
  }

  return text.slice(1, entity.length).split("@")[0];
};

/**
 * `collectUpdateEvents`
 *
 * Collects the Update Events values.
 * @param update - The Telegram update to inspect.
 * @returns Returns the collected values.
 */
export const collectUpdateEvents = (update: Update) => {
  const events = ["update"];
  const command = getCommand(update);
  const callbackData = getCallbackQueryData(update);

  if (update.message) {
    events.push("message");
  }

  if (command) {
    events.push("command", `command:${command}`);
  }

  if (update.callback_query) {
    events.push("callback_query");
  }

  if (callbackData) {
    events.push(`callback_query:${callbackData}`);
  }

  return events;
};
