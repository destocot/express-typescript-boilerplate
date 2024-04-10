import server from "./server";
import http from "node:http";
import * as errorUtils from "@/lib/utils/error-utils";
import logger from "@/lib/logger";
import { FatalErrorEvent } from "@/types";

let httpServer: http.Server;

const port = 5001;
const start = () => {
  httpServer = http.createServer(server).listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};
start();

process.on("unhandledRejection", (err: Error) => {
  errorUtils.handleFatalError(err, FatalErrorEvent.REJECTION);
});

process.on("uncaughtException", (err: Error) => {
  errorUtils.handleFatalError(err, FatalErrorEvent.EXCEPTION);
});

process.on("SIGTERM", () => {
  logger.info("🛑 Shutting server down gracefully");
  httpServer.close();
});
