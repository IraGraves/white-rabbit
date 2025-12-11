import { config } from '../config';

/**
 * Logger utility to control console output based on configuration.
 * Only outputs logs if config.debug is true.
 * Errors are always logged.
 */
export const Logger = {
  log: (...args: unknown[]): void => {
    if (config.debug) {
      console.log(...args);
    }
  },
  warn: (...args: unknown[]): void => {
    if (config.debug) {
      console.warn(...args);
    }
  },
  error: (...args: unknown[]): void => {
    // Errors bypass debug flag and are always logged
    console.error(...args);
  },
  info: (...args: unknown[]): void => {
    if (config.debug) {
      console.info(...args);
    }
  },
};
