export interface NestCompiledModule {
  get<TInput = unknown, TResult = TInput>(token: unknown, options?: { strict?: boolean }): TResult;
  init?(): Promise<unknown>;
}
