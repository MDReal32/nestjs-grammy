import type { CommandOptions } from "../../types/command-options";
import { Command } from "../command";

export const Help = (options?: CommandOptions) => Command("help", options);
