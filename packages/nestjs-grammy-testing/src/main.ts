import "reflect-metadata";

import { registerGrammyMatchers } from "./matchers";
import "./matchers/jest-matchers";

export * from "./matchers";
export * from "./mock-api";
export type * from "./mock-api";
export * from "./module";
export * from "./registry";
export * from "./testing-tokens";
export * from "./tester";
export * from "./update-factory";
export type * from "./types";

registerGrammyMatchers();
