import { Express } from "express";
import config from "config";
import { authenticate, login } from "../controller/auth.controller";

const authRoutes = (app: Express) => {
  const apiVersion = config.get<string>("apiVersion");

  app.post(`${apiVersion}/auth/login`, login);
  app.post(`${apiVersion}/auth/authenticate`, authenticate);
};

export default authRoutes;
