import { BadRequestError, ConflictError, NotFoundError } from "@/lib/errors";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import type { Request, Response, NextFunction } from "express";
import logger from "@/lib/logger";

export const handlePrismaErrors = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof PrismaClientKnownRequestError) {
    logger.error(`${err.name} ${err.code} ${err.message}`);
    switch (err.code) {
      case "P2025":
        throw new NotFoundError("Resource not found");
      case "P2002": {
        const message = generateConflictMessage(err.meta);
        throw new ConflictError(message);
      }
    }
  }

  if (err instanceof PrismaClientValidationError) {
    logger.error(`${err.name} ${err.message}`);
    throw new BadRequestError("Invalid data");
  }

  next(err);
};

function generateConflictMessage(meta: PrismaClientKnownRequestError["meta"]) {
  if (!meta) return "Resource already exists";

  const { modelName, target } = meta;
  if (!Array.isArray(target) || typeof modelName !== "string") {
    logger.error("Invalid Prisma error meta");
    return "Resource already exists";
  }

  const field = target[0];

  return `${modelName} ${field} already exists`;
}
