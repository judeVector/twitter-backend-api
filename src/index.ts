import express from "express";
import config from "config";
import logger from "./utils/logger";
import userRoutes from "./routes/user.routes";
import tweetRoutes from "./routes/tweet.routes";
import authRoutes from "./routes/auth.routes";
import { apiAuthMiddleware } from "./middleware/apiAuthMiddleware";
import swaggerDocs from "./utils/swagger";

const app = express();

app.use(express.json());

const PORT = config.get<number>("port");

// Use the auth middleware globally, except for auth routes
app.use(apiAuthMiddleware);

app.get("/healthcheck", (req, res) => {
  res.status(200).json({ status: "App is running......" });
});

app.listen(PORT, async () => {
  userRoutes(app);
  tweetRoutes(app);
  authRoutes(app);

  swaggerDocs(app, PORT);

  logger.info(`Server is listening at http://127.0.0.1:${PORT}`);
});
