import { Request, Response } from "express";

// Get all Tweets
export const getTweets = async (req: Request, res: Response) => {
  res.status(200).json({
    message: "Tweet Status Success",
  });
};
