import { Request, Response } from "express";

// Get all Users
export const getUsers = async (req: Request, res: Response) => {
  res.status(200).json({
    message: "Success",
  });
};

// Create a new User
export const createUser = async (req: Request, res: Response) => {
  res.status(501).json({ error: "Not implemented" });
};

// Get user by id
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  res.status(200).json({ error: `Not implemented ${id}` });
};

// Update a user
export const updateUser = (req: Request, res: Response) => {
  const { id } = req.params;

  res.status(200).json({ error: `Not implemented ${id}` });
};

// Delete a user
export const deleteUser = (req: Request, res: Response) => {
  const { id } = req.params;

  res.status(200).json({ error: `Not implemented ${id}` });
};
