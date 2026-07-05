import { expect } from "expect";
import "reflect-metadata";

import { registerGrammyMatchers } from "../build/matchers.js";

registerGrammyMatchers(expect);
