import express from "express";
import config from "config";
import logger from "./utils/logger";
import userRoutes from "./routes/user.routes";
import tweetRoutes from "./routes/tweet.routes";
import authRoutes from "./routes/auth.routes";
import { authenticateToken } from "./middleware/authMidlleware";

const app = express();

app.use(express.json());
app.use(authenticateToken);

const PORT = config.get<number>("port");

app.listen(PORT, async () => {
  userRoutes(app);
  tweetRoutes(app);
  authRoutes(app);

  logger.info(`Server is listening at http://127.0.0.1:${PORT}`);
});
