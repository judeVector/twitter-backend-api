import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all Tweets
export const getTweets = async (req: Request, res: Response) => {
  try {
    const allTweets = await prisma.tweet.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
    });
    res.status(200).json({ tweets: allTweets });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// Get Tweets by Id
export const getTweetsById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const tweet = await prisma.tweet.findUnique({
      where: { id: Number(id) },
      include: { user: true },
    });

    if (!tweet) {
      res.status(404).json({ error: `User with id: ${id} not found` });
    } else {
      const tweets = await prisma.tweet.findUnique({
        where: { id: Number(id) },
        include: { user: true },
      });
      res.status(200).json(tweets);
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// Create a new Tweet
export const createTweet = async (req: Request, res: Response) => {
  try {
    const { content, image, userId } = req.body;

    if (!userId) {
      res.status(404).json({ error: "A tweet can only be created with a user, add a userId" });
    } else {
      const result = await prisma.tweet.create({
        data: {
          content,
          image,
          userId,
        },
      });
      res.status(201).json({ tweet: result });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// Delete a tweet
export const deleteTweet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const tweet = await prisma.user.findUnique({ where: { id: Number(id) } });

    if (!tweet) {
      res.status(404).json({ error: `Tweet with id: ${id} does not exist!` });
    } else {
      await prisma.tweet.delete({ where: { id: Number(id) } });
      res.status(200).json({ message: "Tweet deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
