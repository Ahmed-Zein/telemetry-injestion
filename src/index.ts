// cypod-telemetry
import "dotenv/config";
import express, { type Request, type Response } from "express";
import { connectDB } from "./infra/db/db.context.js";
import alertsRouter from "./routes/alerts.router.js";
import authRouter from "./routes/auth.router.js";
import devicesRouter from "./routes/devices.router.js";
import { logger } from "./utils/logger.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

app.use("/alerts", alertsRouter);
app.use("/auth", authRouter);
app.use("/devices", devicesRouter);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello World" });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

app.use((err: Error, req: Request, res: Response) => {
  // TODO: Add proper error handling here
  logger.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running at http://localhost:${PORT}`);
});
