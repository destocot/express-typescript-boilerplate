import type { Request, Response, NextFunction } from "express";
import logger from "@/lib/logger";
import { CustomError } from "@/lib/errors/custom-error";

export const handleErrors = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    logger.error(`${err.statusCode} ${err.serializeErrors().message}`);
    return res.status(err.statusCode).json(err.serializeErrors());
  }

  logger.error(err);
  return res.status(500).send({ message: err.message });
};
