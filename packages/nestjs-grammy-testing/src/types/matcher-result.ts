export interface MatcherResult {
  readonly pass: boolean;
  readonly message: () => string;
}
