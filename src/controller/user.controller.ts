import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
    res.status(500).json({ error: error });
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
      where: { id: Number(id) },
      include: { tweets: true },
    });

    // Handling not found scenario
    if (!user) {
      res.status(404).json({ error: `User with id: ${id} not found` });
    } else {
      res.status(200).json({ data: user });
    }
  } catch (error) {
    res.status(500).json({ error: error });
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
    const { email, name, username } = req.body;

    // Validating input data
    if (!email || !username || !name) {
      res.status(404).json({ error: { message: "Invalid email, name, or username provided" } });
    } else {
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
    }
  } catch (error) {
    // Handling unique constraint violation errors and sending a 500 status response
    res.status(500).json({ error: "Username and email should be unique" });
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
  const { bio, name, image } = req.body;

  try {
    // Updating a user in the database
    const result = await prisma.user.update({
      where: { id: Number(id) },
      data: { bio, name, image },
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: "Failed to update the user" });
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
    const user = await prisma.user.findUnique({ where: { id: Number(id) } });

    // Handling not found scenario
    if (!user) {
      res.status(404).json({ error: `User with id: ${id} does not exist!` });
    } else {
      // Deleting a user from the database
      await prisma.user.delete({ where: { id: Number(id) } });
      res.status(200).json({ message: "User deleted successfully" });
    }
  } catch (error) {
    // Handling errors and sending a 500 status response
    res.status(500).json({ error: error });
  }
};
