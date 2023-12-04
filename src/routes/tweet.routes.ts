import { Express, Request, Response } from "express";
import { getTweets } from "../controller/tweet.controller";
import config from "config";

const tweetRoutes = (app: Express) => {
  const apiVersion = config.get<string>("apiVersion");
  app.get(`${apiVersion}/tweets`, getTweets);
};

export default tweetRoutes;
