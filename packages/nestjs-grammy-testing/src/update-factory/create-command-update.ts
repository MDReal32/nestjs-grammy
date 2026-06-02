import type { CommandUpdateOptions } from "../types";
import { createMessageUpdate } from "./create-message-update";
import type { MessageUpdate } from "./message-update";

export const createCommandUpdate = (options: CommandUpdateOptions = {}): MessageUpdate => {
  const rawCommand = options.command ?? "/start";
  const command = rawCommand.startsWith("/") ? rawCommand : `/${rawCommand}`;
  const text = options.args ? `${command} ${options.args}` : command;

  const update = createMessageUpdate({
    ...options,
    text
  });

  update.message.entities = [
    {
      offset: 0,
      length: command.length,
      type: "bot_command"
    }
  ];

  return update;
};
