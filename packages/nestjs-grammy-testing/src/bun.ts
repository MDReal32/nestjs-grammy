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
 * Bun test entry point.
 *
 * Import once from a Bun test preload file (`bunfig.toml` -> `preload`):
 *
 * ```ts
 * // bun.setup.ts
 * import "@mdreal/nestjs-grammy-testing/bun";
 * ```
 */
import { expect } from "bun:test";
import "reflect-metadata";

import { grammyMatchers, registerGrammyMatchers } from "./matchers";
import type { GrammyMatcherAssertions } from "./types";

registerGrammyMatchers(expect);

declare module "bun:test" {
  interface Matchers<T = unknown> extends GrammyMatcherAssertions<T> {}
  interface AsymmetricMatchers extends GrammyMatcherAssertions<unknown> {}
}

export { grammyMatchers, registerGrammyMatchers };
export type { GrammyMatcherAssertions };
