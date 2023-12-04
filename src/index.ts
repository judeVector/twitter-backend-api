import express from "express";
import config from "config";
import logger from "./utils/logger";

const app = express();

app.use(express.json());

const PORT = config.get<number>("port");

app.get("/", (req, res) => {
  res.json("Hello, world!");
});

app.listen(PORT, async () => {
  logger.info(`Serving is listening at http://127.0.0.1:${PORT}`);

  // await connectDB();

  // routes(app);
});
