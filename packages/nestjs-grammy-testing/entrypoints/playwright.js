import "reflect-metadata";

import { expect } from "@playwright/test";

import { registerGrammyMatchers } from "../build/matchers.js";

registerGrammyMatchers(expect);
