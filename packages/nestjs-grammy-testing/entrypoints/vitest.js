import "reflect-metadata";
import { expect } from "vitest";

import { registerGrammyMatchers } from "../build/matchers.js";

registerGrammyMatchers(expect);
