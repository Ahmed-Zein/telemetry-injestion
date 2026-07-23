// cypod-telemetry
import "dotenv/config";
import express, { NextFunction, type Request, type Response } from "express";
import { connectDB } from "./infra/db/db.context.js";
import { logger } from "./utils/logger.js";
import cors from "cors";
import apiRouter from "./routes/api.router.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(
  cors({
    origin: "http://localhost:5173", // note: move to config
  }),
);

app.use(express.json());
app.use(apiRouter);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello World" });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  // note: Add proper error handling here
  logger.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running at http://localhost:${PORT}`);
});
