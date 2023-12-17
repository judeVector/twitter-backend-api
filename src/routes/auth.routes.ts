import { Express } from "express";
import config from "config";
import { authenticate, login } from "../controller/auth.controller";

const authRoutes = (app: Express) => {
  const apiVersion = config.get<string>("apiVersion");

  app.post(`${apiVersion}/login`, login);
  app.post(`${apiVersion}/authenticate`, authenticate);
};

export default authRoutes;
