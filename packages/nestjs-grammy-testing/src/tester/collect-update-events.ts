import type { Update } from "grammy/types";

const getMessageText = (update: Update) => update.message?.text;

const getCallbackQueryData = (update: Update) => update.callback_query?.data;

const getCommand = (update: Update) => {
  const text = getMessageText(update);
  const entity = update.message?.entities?.find(item => item.type === "bot_command" && item.offset === 0);

  if (!text || !entity) {
    return undefined;
  }

  return text.slice(1, entity.length).split("@")[0];
};

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
