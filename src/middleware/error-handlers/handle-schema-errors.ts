import type { Request, Response, NextFunction } from "express";
import logger from "@/lib/logger";
import { ZodError } from "zod";
import { BadRequestError } from "@/lib/errors";

export const handleSchemaErrors = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    logger.error(`${err.name} ${err.message}`);
    const error = err.errors[0]?.message ?? "Invalid data";
    throw new BadRequestError(error);
  }

  next(err);
};
