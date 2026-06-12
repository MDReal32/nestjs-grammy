import type { Context as GrammyContext } from "grammy";

import type { BotInstanceOptions } from "../types";
import type { RunnerMode } from "./runner-mode";

export const resolveMode = <C extends GrammyContext>(opts: BotInstanceOptions<C>) => {
  if (opts.mode && opts.mode !== "auto") {
    return opts.mode;
  }

  return opts.webhook?.url ? "webhook" : ("polling" as RunnerMode);
};
