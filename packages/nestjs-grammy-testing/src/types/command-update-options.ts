import type { MessageUpdateOptions } from "./message-update-options";

export interface CommandUpdateOptions extends Omit<MessageUpdateOptions, "text"> {
  readonly command?: string;
  readonly args?: string;
}
