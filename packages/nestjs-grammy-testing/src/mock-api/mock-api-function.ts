export interface MockApiFunction {
  (payload?: unknown, signal?: unknown): Promise<unknown>;
  readonly _isMockFunction: true;
  readonly mock: { calls: unknown[][] };
  readonly calls: unknown[][];
  mockClear(): void;
  mockReset(): void;
  getMockName(): string;
}
