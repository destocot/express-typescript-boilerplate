import express from "express";
import type { Application } from "express";
import morgan from "morgan";
import router from "@/routes";
import { NotFoundError } from "@/lib/errors";
import {
  handleErrors,
  handlePrismaErrors,
  handleSchemaErrors,
} from "@/middleware/error-handlers";

const server: Application = express();
server.use(morgan("dev", { skip: () => process.env.NODE_ENV === "test" }));
server.use(express.json());

server.get("/healthcheck", (_, res) => {
  res.sendStatus(200);
});

server.use("/api", router);

server.all("*", () => {
  throw new NotFoundError("Route not found");
});

server.use(handleSchemaErrors);
server.use(handlePrismaErrors);
server.use(handleErrors);

export default server;
