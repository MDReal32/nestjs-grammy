/*
 * Copyright 2025 MDReal
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Standalone `expect` entry point.
 *
 * For any runner that uses the standalone `expect` package (e.g. Mocha or
 * `node:test` paired with `expect`):
 *
 * ```ts
 * import "@mdreal/nestjs-grammy-testing/expect";
 * ```
 */
import { expect } from "expect";
import "reflect-metadata";

import { grammyMatchers, registerGrammyMatchers } from "./matchers";
import type { GrammyMatcherAssertions } from "./types";

registerGrammyMatchers(expect);

declare module "expect" {
  interface Matchers<R, T = unknown> extends GrammyMatcherAssertions<R> {}
  interface AsymmetricMatchers extends GrammyMatcherAssertions<void> {}
}

export { grammyMatchers, registerGrammyMatchers };
export type { GrammyMatcherAssertions };
