import { Request, Response, NextFunction } from "express";
import { NODE_ENV } from "../constants/env.js";
import { INTERNAL_SERVER_ERROR } from "../constants/http.js";
import logger from "../lib/logger.js";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.statusCode || INTERNAL_SERVER_ERROR;
  const message = err.message || "Internal Server Error";

  logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`, { stack: err.stack });

  res.status(statusCode).json({
    message,
    stack: NODE_ENV === "production" ? null : err.stack,
  });
};

export default errorHandler;
