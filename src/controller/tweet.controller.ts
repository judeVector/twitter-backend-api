import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

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
      res.status(200).json(tweet);
    }
    console.log(tweet);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// Create a new Tweet
export const createTweet = async (req: any, res: any) => {
  try {
    const { content, image } = req.body;
    const user = req.user;

    const result = await prisma.tweet.create({
      data: {
        content,
        image,
        userId: user.id,
      },
    });
    res.status(200).json({ result: result });
  } catch (error) {
    res.status(500).json({ error: "Username and email should be unique" });
  }
};

// Delete a tweet
export const deleteTweet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const tweet = await prisma.tweet.findUnique({ where: { id: Number(id) } });

    if (!tweet) {
      res.status(404).json({ error: `Tweet with id: ${id} does not exist!` });
    } else {
      await prisma.tweet.delete({ where: { id: Number(id) } });
      res.status(200).json({ message: "Tweet deleted successfully" });
    }
    console.log(tweet);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
