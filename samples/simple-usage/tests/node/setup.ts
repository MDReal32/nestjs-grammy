import { after, afterEach, before, beforeEach, describe, it } from "node:test";

import { expect } from "expect";

import "@mdreal/nestjs-grammy-testing/expect";

Object.assign(globalThis, { describe, it, before, after, beforeEach, afterEach, expect });
