import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { TokenPayload } from "../types/index.js";
import { JWT_SECRET } from "../constants/env.js";
import { UNAUTHORIZED, FORBIDDEN } from "../constants/http.js";
import logger from "../lib/logger.js";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    logger.warn(`Authentication failed: No token provided for ${req.originalUrl}`);
    return res
      .status(UNAUTHORIZED)
      .json({ message: "Authentication token required" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      logger.warn(`Authentication failed: Invalid/Expired token for ${req.originalUrl}`);
      return res
        .status(FORBIDDEN)
        .json({ message: "Invalid or expired token" });
    }
    req.user = user as TokenPayload;
    next();
  });
};

export const authorizeRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      logger.warn(`Authorization failed: User ${req.user?.email || "Unknown"} with role ${req.user?.role || "NONE"} attempted to access ${req.originalUrl} requiring ${roles.join(", ")}`);
      return res
        .status(FORBIDDEN)
        .json({ message: "Unauthorized: Insufficient permissions" });
    }
    next();
  };
};
