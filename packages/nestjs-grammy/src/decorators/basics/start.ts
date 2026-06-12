import type { CommandOptions } from "../../types/command-options";
import { Command } from "../command";

export const Start = (options?: CommandOptions) => Command("start", options);
