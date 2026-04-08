import { Request, Response } from "express";
import { OK } from "../constants/http.js";
import { asyncHandler } from "../lib/asyncHandler.js";
import APIResponse from "../lib/APIResponse.js";
import logger from "../lib/logger.js";

export const healthCheck = asyncHandler(async (req: Request, res: Response) => {
  logger.debug("Health check performed");
  res
    .status(OK)
    .json(
      new APIResponse(
        OK,
        { status: "healthy", timestamp: new Date().toISOString() },
        "API is running optimally",
      ),
    );
});
