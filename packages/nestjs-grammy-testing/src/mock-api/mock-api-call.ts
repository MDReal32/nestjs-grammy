export interface MockApiCall {
  readonly method: string;
  readonly payload: unknown;
  readonly signal?: unknown;
}
