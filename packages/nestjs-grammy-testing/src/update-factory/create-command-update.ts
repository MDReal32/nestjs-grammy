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
import type { CommandUpdateOptions } from "../types";
import { createMessageUpdate } from "./create-message-update";
import type { MessageUpdate } from "./message-update";

/**
 * `createCommandUpdate`
 *
 * Creates the Command Update value.
 * @param options - Optional configuration for the operation.
 * @returns Returns the created value.
 */
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
