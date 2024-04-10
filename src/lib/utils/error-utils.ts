import logger from "@/lib/logger";
import { FatalErrorEvent } from "@/types";

export const handleFatalError = (err: Error, evt: FatalErrorEvent) => {
  logger.error(err.name + " - " + err.message);
  logger.error(`UNHANDLED ${evt} 💥 Shutting down...`);
  process.exit(1);
};
