import { Request, Response, NextFunction } from "express";
import APIError from "../lib/APIError.js";
import { NOT_FOUND } from "../constants/http.js";
import logger from "../lib/logger.js";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  logger.warn(`404 - Not Found - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  next(new APIError(NOT_FOUND, `Not Found - ${req.originalUrl}`));
};

export default notFound;
