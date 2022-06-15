export const info = console.log;
export const warn = console.warn;
export const debug = console.log; // TODO only when dev or debug flag on
export const error = console.error;

export const makeLogger = (ns: string) => ({
  info: (...a: any[]) => info(`[${ns}]`, ...a),
  warn: (...a: any[]) => warn(`[${ns}]`, ...a),
  debug: (...a: any[]) => debug(`[${ns}]`, ...a),
  error: (...a: any[]) => error(`[${ns}]`, ...a),
  throw: (...a: any[]) => {
    throw a;
  },
});
