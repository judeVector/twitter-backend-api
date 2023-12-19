import { Request, Response, NextFunction } from "express";
import { authenticateToken } from "./authMiddleware";

export const apiAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith("/api/v1/auth")) {
    // Skip authentication middleware for auth routes
    return next();
  }
  authenticateToken(req, res, next);
};
