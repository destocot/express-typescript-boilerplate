import pino, { LoggerOptions } from "pino";
import { PrettyOptions } from "pino-pretty";

let level: pino.LevelWithSilent = "info";

if (process.env.NODE_ENV === "production") {
  level = "debug";
}

if (process.env.NODE_ENV === "test") {
  level = "silent";
}

const logger = pino({
  level,
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      levelFirst: true,
      translateTime: "yyyy-dd-mm h:MM:ss TT",
    } satisfies PrettyOptions,
  },
  base: null,
} as LoggerOptions);

export default logger;
