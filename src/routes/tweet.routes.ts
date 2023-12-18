import { Express } from "express";
import { createTweet, deleteTweet, getTweets, getTweetsById } from "../controller/tweet.controller";
import config from "config";
import { authenticateToken } from "../middleware/authMidlleware";

const tweetRoutes = (app: Express) => {
  const apiVersion = config.get<string>("apiVersion");

  // Use the auth middleware for tweet routes
  app.use(`${apiVersion}/tweet`, authenticateToken);

  app.get(`${apiVersion}/tweet`, getTweets);
  app.get(`${apiVersion}/tweet/:id`, getTweetsById);
  app.post(`${apiVersion}/tweet`, createTweet);
  app.delete(`${apiVersion}/tweet/:id`, deleteTweet);
};

export default tweetRoutes;
