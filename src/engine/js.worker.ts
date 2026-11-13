/// <reference lib="webworker" />
import { runJs } from './jsHarness';

self.onmessage = (e: MessageEvent) => {
  const { id, code, tests, stdin } = e.data;
  self.postMessage({ id, result: runJs(code, tests ?? [], stdin ?? '') });
};
