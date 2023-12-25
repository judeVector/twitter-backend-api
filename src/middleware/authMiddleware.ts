import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

// Secret key for JWT token verification
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

// Extending Express Request type to include a 'user' property for authenticated users
type AuthRequest = Request & { user?: User };

/**
 * Middleware function for authenticating requests using JWT tokens.
 *
 * @param req - Express request object extended with 'user' property.
 * @param res - Express response object.
 * @param next - Express next function to pass control to the next middleware.
 */
export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Extracting JWT token from the Authorization header
    const authHeader = req.headers["authorization"];
    const jwtToken = authHeader?.split(" ")[1];

    // Checking if the JWT token is present
    if (!jwtToken) {
      return res.status(401).json({ status: "Unauthorized" });
    }

    // Decoding the JWT token
    const payload = jwt.verify(jwtToken, JWT_SECRET, { algorithms: ["HS256"] }) as {
      tokenId: string;
    };

    // Retrieving the token from the database along with associated user
    const dbToken = await prisma.token.findUnique({
      where: { id: payload.tokenId },
      include: {
        user: true,
      },
    });

    console.log(dbToken);

    // Checking if the token is valid and not expired
    if (!dbToken || dbToken.expiration < new Date()) {
      return res.status(401).json({ error: "API token expired" });
    }

    // Assigning the user object to the 'user' property in the request
    req.user = dbToken.user;
  } catch (error) {
    // Handle errors, typically caused by token verification failure
    console.error("Token verification error:", error);
    return res.status(401).json({ error: "Invalid token" });
  } finally {
    // Ensure proper Prisma client disconnection
    await prisma.$disconnect();
  }

  // Pass control to the next middleware
  next();
};
