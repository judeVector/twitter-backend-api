import { Express, Request, Response } from "express";
import { createUser, getUserById, getUsers } from "../controller/user.controller";
import config from "config";

const userRoutes = (app: Express) => {
  const apiVersion = config.get<string>("apiVersion");
  app.get(`${apiVersion}/users`, getUsers);
  app.post(`${apiVersion}/users`, createUser);
  app.get(`${apiVersion}/users/:id`, getUserById);
};

export default userRoutes;
