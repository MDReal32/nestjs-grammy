import { expect } from "bun:test";
import "reflect-metadata";

import { registerGrammyMatchers } from "../build/matchers.js";

registerGrammyMatchers(expect);
