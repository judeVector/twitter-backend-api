import { Express, Request, Response } from "express";
import { createTweet, deleteTweet, getTweets, getTweetsById } from "../controller/tweet.controller";
import config from "config";

const tweetRoutes = (app: Express) => {
  const apiVersion = config.get<string>("apiVersion");
  app.get(`${apiVersion}/tweets`, getTweets);
  app.get(`${apiVersion}/tweets/:id`, getTweetsById);
  app.post(`${apiVersion}/tweets`, createTweet);
  app.delete(`${apiVersion}/tweets/:id`, deleteTweet);
};

export default tweetRoutes;
