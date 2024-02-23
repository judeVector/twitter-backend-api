import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { createUserSchema } from "../utils/validation";

// Initialize Prisma client
const prisma = new PrismaClient();

// Utility function to send standardized error responses
const sendError = (res: Response, status: number, message: string) => {
  res.status(status).json({ error: message });
};

/**
 * Get all users from the database.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 */
export const getUsers = async (req: Request, res: Response) => {
  try {
    // Fetching all users from the database
    const allUsers = await prisma.user.findMany();
    res.status(200).json({ data: allUsers });
  } catch (error) {
    // Handling errors and sending a standardized error response
    sendError(res, 500, (error as Error).message || "Internal Server Error");
  }
};

/**
 * Get a user by their ID from the database.
 *
 * @param req - Express request object with parameters.
 * @param res - Express response object.
 */
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Fetching a user by their ID from the database
    const user = await prisma.user.findUnique({
      where: { id: String(id) },
      include: { tweets: true },
    });

    // Handling not found scenario
    if (!user) {
      sendError(res, 404, `User with id: ${id} not found`);
    } else {
      res.status(200).json({ data: user });
    }
  } catch (error: any) {
    // Handling errors and sending a standardized error response
    sendError(res, 500, (error as Error).message || "Internal Server Error");
  }
};

/**
 * Create a new user in the database.
 *
 * @param req - Express request object with body data.
 * @param res - Express response object.
 */
export const createUser = async (req: Request, res: Response) => {
  try {
    const { error } = createUserSchema.validate(req.body);

    if (error) {
      // If validation fails, send a 400 Bad Request response with the validation error
      sendError(res, 400, error.details[0].message);
      return;
    }

    const { email, name, username } = req.body;

    // Creating a new user in the database
    const user = await prisma.user.create({
      data: {
        email,
        name,
        username,
        bio: "Hello, I'm new on Twitter",
      },
    });

    res.status(201).json({ user: user });
  } catch (error) {
    // Handling unique constraint violation errors and sending a standardized error response
    sendError(
      res,
      500,
      "This username or email is already in use. Please choose a different username or use a different email address."
    );
  }
};

/**
 * Update a user in the database.
 *
 * @param req - Express request object with parameters and body data.
 * @param res - Express response object.
 */
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { bio, name, image, username } = req.body;

  try {
    // Updating a user in the database
    const result = await prisma.user.update({
      where: { id: String(id) },
      data: { bio, name, image, username },
    });
    res.status(200).json(result);
  } catch (error) {
    // Handling errors and sending a standardized error response
    sendError(res, 400, "Failed to update the user");
  }
};

/**
 * Delete a user from the database.
 *
 * @param req - Express request object with parameters.
 * @param res - Express response object.
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Finding a user by ID in the database
    const user = await prisma.user.findUnique({ where: { id: String(id) } });

    // Handling not found scenario
    if (!user) {
      sendError(res, 404, `User with id: ${id} does not exist!`);
    } else {
      // Deleting a user from the database
      await prisma.user.delete({ where: { id: String(id) } });
      res.status(200).json({ message: "User deleted successfully" });
    }
  } catch (error: any) {
    // Handling errors and sending a standardized error response
    sendError(res, 500, error.message || "Internal Server Error");
  }
};

// Close Prisma connection middleware
export const closePrismaConnection = async (req: Request, res: Response, next: NextFunction) => {
  await prisma.$disconnect();
  next();
};
