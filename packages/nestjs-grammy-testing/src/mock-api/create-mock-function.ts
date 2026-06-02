import type { MockApiCall } from "./mock-api-call";
import type { MockApiFunction } from "./mock-api-function";

export const createMockFunction = (
  method: string,
  calls: MockApiCall[],
  resolveResult: (method: string, payload: unknown) => unknown
): MockApiFunction => {
  const fn = ((payload?: unknown, signal?: unknown) => {
    calls.push({
      method,
      payload: payload ?? {},
      signal
    });
    fn.mock.calls.push(payload === undefined ? [] : [payload, signal].filter(value => value !== undefined));

    return Promise.resolve(resolveResult(method, payload));
  }) as MockApiFunction;

  Object.defineProperties(fn, {
    _isMockFunction: { value: true },
    mock: { value: { calls: [] } },
    calls: {
      get() {
        return fn.mock.calls;
      }
    }
  });

  fn.mockClear = () => {
    fn.mock.calls.length = 0;
  };
  fn.mockReset = fn.mockClear;
  fn.getMockName = () => method;

  return fn;
};
