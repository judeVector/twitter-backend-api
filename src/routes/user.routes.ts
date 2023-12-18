import { Express, Request, Response } from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controller/user.controller";
import config from "config";
import { authenticateToken } from "../middleware/authMidlleware";

const userRoutes = (app: Express) => {
  const apiVersion = config.get<string>("apiVersion");

  // Use the auth middleware for user routes
  app.use(`${apiVersion}/users`, authenticateToken);

  app.get(`${apiVersion}/users`, getUsers);
  app.post(`${apiVersion}/users`, createUser);
  app.get(`${apiVersion}/users/:id`, getUserById);
  app.put(`${apiVersion}/users/:id`, updateUser);
  app.delete(`${apiVersion}/users/:id`, deleteUser);
};

export default userRoutes;
