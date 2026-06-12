import type { BotInstanceOptions } from "../types";

export type RunnerMode = NonNullable<Exclude<BotInstanceOptions["mode"], "auto">>;
