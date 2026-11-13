// Minimal type declarations for sql.js (the package ships without types). Only what Loopwise uses.
declare module 'sql.js' {
  interface InitOptions {
    locateFile?: (file: string) => string;
  }
  export default function initSqlJs(options?: InitOptions): Promise<unknown>;
}
