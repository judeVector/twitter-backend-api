import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = "SUPER SECRET";

type AuthRequest = Request & { user?: User };

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];
    const jwtToken = authHeader?.split(" ")[1];
    console.log(jwtToken);

    if (!jwtToken) {
      return res.sendStatus(401);
    }

    // Decoding the jwt token
    const payload = jwt.verify(jwtToken, JWT_SECRET) as { tokenId: number };
    const dbToken = await prisma.token.findUnique({
      where: { id: payload.tokenId },
      include: {
        user: true,
      },
    });

    if (!dbToken || dbToken.expiration < new Date()) {
      return res.status(401).json({ error: "API token expired" });
    }

    req.user = dbToken.user;
  } catch (error) {
    return res.sendStatus(401);
  }

  next();
};
