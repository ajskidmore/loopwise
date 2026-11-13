export interface TestResult {
  name: string;
  passed: boolean;
  message?: string;
}

export interface RunResult {
  output: string;
  /** Formatted error message, or null if the program finished normally. */
  error: string | null;
  tests: TestResult[];
  timedOut?: boolean;
}
