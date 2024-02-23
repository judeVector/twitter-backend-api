import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

/**
 * Get all tweets from the database, including user details.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 */
export const getTweets = async (req: Request, res: Response) => {
  try {
    // Fetching all tweets from the database, including user details
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

/**
 * Get a tweet by its ID from the database, including user details.
 *
 * @param req - Express request object with parameters.
 * @param res - Express response object.
 */
export const getTweetsById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Fetching a tweet by its ID from the database, including user details
    const tweet = await prisma.tweet.findUnique({
      where: { id: Number(id) },
      include: { user: true },
    });

    // Handling not found scenario
    if (!tweet) {
      res.status(404).json({ error: `Tweet with id: ${id} not found` });
    } else {
      res.status(200).json(tweet);
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

/**
 * Create a new tweet in the database.
 *
 * @param req - Express request object with body data and user information.
 * @param res - Express response object.
 */
export const createTweet = async (req: any, res: any) => {
  try {
    const { content, image } = req.body;
    const user = req.user;

    // Creating a new tweet in the database
    const result = await prisma.tweet.create({
      data: {
        content,
        image,
        userId: user.id,
      },
    });
    res.status(200).json({ result: result });
  } catch (error) {
    res.status(500).json({ error: "Failed to create a new tweet" });
  }
};

/**
 * Delete a tweet from the database.
 *
 * @param req - Express request object with parameters.
 * @param res - Express response object.
 */
export const deleteTweet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Finding a tweet by ID in the database
    const tweet = await prisma.tweet.findUnique({ where: { id: Number(id) } });

    // Handling not found scenario
    if (!tweet) {
      res.status(404).json({ error: `Tweet with id: ${id} does not exist!` });
    } else {
      // Deleting a tweet from the database
      await prisma.tweet.delete({ where: { id: Number(id) } });
      res.status(200).json({ message: "Tweet deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
