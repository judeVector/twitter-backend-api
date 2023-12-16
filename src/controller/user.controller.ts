import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all Users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await prisma.user.findMany();
    res.status(200).json({ data: allUsers });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// { select: { id: true, name: true, image: true } }

// const users = await prisma.user.findMany({
//   // Returns all user fields
//   include: {
//     posts: {
//       select: {
//         title: true,
//       },
//     },
//   },
// });

// Get user by id
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: { tweets: true },
    });

    if (!user) {
      res.status(404).json({ error: `User with id: ${id} not found` });
    } else {
      res.status(200).json({ data: user });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// Create a new User
export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, name, username } = req.body;

    if (!email || !username || !name) {
      res.status(404).json({ error: { message: "Invalid email, name or username provided" } });
    } else {
      const user = await prisma.user.create({
        data: {
          email,
          name,
          username,
          bio: "Hello I'm new on Twitter",
        },
      });
      res.status(201).json({ user: user });
    }
  } catch (error) {
    res.status(500).json({ error: "username and email should be unique" });
  }
};

// Update a user
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { bio, name, image } = req.body;

  try {
    const result = await prisma.user.update({
      where: { id: Number(id) },
      data: { bio, name, image },
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: "Failed to update the user" });
  }
};

// Delete a user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id: Number(id) } });

    if (!user) {
      res.status(404).json({ error: `User with id: ${id} does not exist!` });
    } else {
      await prisma.user.delete({ where: { id: Number(id) } });
      res.status(200).json({ message: "User deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
