import type { DynamicModule, ForwardReference, Type } from "@nestjs/common";

export type NestTestingImport = Type<unknown> | DynamicModule | Promise<DynamicModule> | ForwardReference;
