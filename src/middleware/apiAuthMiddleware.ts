import { Request, Response, NextFunction } from "express";
import { authenticateToken } from "./authMiddleware";

const AUTH_ROUTE_PREFIX = "/api/v1/auth";

/**
 * Middleware function for API authentication.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next function to pass control to the next middleware.
 */
export const apiAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Check if the request path starts with "/api/v1/auth"
  if (req.path.startsWith(AUTH_ROUTE_PREFIX)) {
    // Skip authentication middleware for auth routes
    return next();
  }

  // If the request path doesn't start with "/api/v1/auth", perform token authentication
  authenticateToken(req, res, next);
};
