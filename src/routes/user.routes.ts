import { Express, Request, Response } from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controller/user.controller";
import config from "config";

const userRoutes = (app: Express) => {
  const apiVersion = config.get<string>("apiVersion");
  app.get(`${apiVersion}/users`, getUsers);
  app.post(`${apiVersion}/users`, createUser);
  app.get(`${apiVersion}/users/:id`, getUserById);
  app.put(`${apiVersion}/users/:id`, updateUser);
  app.delete(`${apiVersion}/users/:id`, deleteUser);
};

export default userRoutes;
