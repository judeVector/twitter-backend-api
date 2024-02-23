import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { sendEmailToken } from "../services/emailService";

import config from "config";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// Retrieving configuration values
const EMAIL_TOKEN_EXPIRATION_MS = config.get<string>("EMAIL_TOKEN_EXPIRATION_MS");
const AUTHENTICATION_EXPIRATION_HOURS = config.get<string>("AUTHENTICATION_EXPIRATION_HOURS");

// Secret key for JWT token verification
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

// Function to generate a random 8-digit number as the email token
const generateEmailToken = (): string => {
  const randomNumber = Math.floor(100000 + Math.random() * 900000).toString();
  const randomCharacters = Math.random().toString(36).substring(2, 4).toUpperCase(); // generates two random characters

  return randomNumber + randomCharacters;
};

// Function to generate JWT Authentication Token
const generateJwtToken = (tokenId: number): string => {
  const jwtPayload = { tokenId };

  return jwt.sign(jwtPayload, JWT_SECRET, {
    algorithm: "HS256",
    noTimestamp: true,
  });
};

/**
 * Login function:
 * - Creates a user if it doesn't already exist
 * - Generates an email token and associates it with the user
 * - Sends the email token to the user's email address (Not implemented here)
 *
 * @param req - Express request object with user email in the body.
 * @param res - Express response object.
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const emailToken = generateEmailToken();

    // Calculating token expiration time
    const expiration = new Date(new Date().getTime() + EMAIL_TOKEN_EXPIRATION_MS);

    // Creating a token in the database
    const createdToken = await prisma.token.create({
      data: {
        type: "EMAIL",
        emailToken,
        expiration,
        user: {
          connectOrCreate: {
            where: { email },
            create: { email, bio: "Hello I'm new on Twitter" },
          },
        },
      },
    });

    // Logging the created token (for testing purposes)
    console.log(createdToken);
    await sendEmailToken(email, emailToken);

    // send email token to users email (Not implemented here)

    res.status(200).json({ message: "Token created successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

/**
 * Authentication function:
 * - Validates the email token
 * - Generates a long-lived JWT token for API authentication
 *
 * @param req - Express request object with user email and email token in the body.
 * @param res - Express response object.
 */
export const authenticate = async (req: Request, res: Response) => {
  try {
    const { email, emailToken } = req.body;

    // Retrieving the email token and associated user from the database
    const dbEmailToken = await prisma.token.findUnique({
      where: {
        emailToken,
      },
      include: {
        user: true,
      },
    });

    // Validating the email token
    if (!dbEmailToken || !dbEmailToken.valid) {
      return res.status(401).json({ error: "Invalid Token" });
    }

    // Checking if the token has expired
    if (dbEmailToken.expiration < new Date()) {
      return res.status(401).json({ error: "Token expired" });
    }

    // Validating that the user is the owner of the email
    if (dbEmailToken?.user?.email !== email) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Generate an API token with expiration time
    const expiration = new Date(new Date().getTime() + AUTHENTICATION_EXPIRATION_HOURS);

    // Creating an API token in the database
    const apiToken = await prisma.token.create({
      data: {
        type: "API",
        expiration,
        user: {
          connect: {
            email,
          },
        },
      },
    });

    // Invalidating the email token by setting its 'valid' field to false
    await prisma.token.update({
      where: {
        id: dbEmailToken.id,
      },
      data: {
        valid: false,
      },
    });

    // Generate the JWT token for API authentication
    const authToken = generateJwtToken(apiToken.id);

    res.status(200).json({ authToken: authToken });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
