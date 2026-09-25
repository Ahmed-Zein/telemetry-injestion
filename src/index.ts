// cypod-telemetry
import "dotenv/config";
import express, { NextFunction, type Request, type Response } from "express";
import { connectDB } from "./infra/db/db.context.js";
import { logger } from "./utils/logger.js";
import cors from "cors";
import apiRouter from "./routes/api.router.js";
import { localeMiddleware } from "./middlewares/locale.js";
import { DEFAULT_LOCALE, t } from "./i18n/index.js";
import { AppError } from "./utils/error.js";
import { DefaultResponse } from "./utils/default.response.js";
import { config } from "./config/index.js";

const app = express();

app.use(
  cors({
    origin: config.server.corsOrigin,
  }),
);

app.use(express.json({ limit: config.server.jsonBodyLimit }));
app.use(localeMiddleware);
app.use(apiRouter);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello World" });
});

app.use((req: Request, res: Response) => {
  const locale = req.locale || DEFAULT_LOCALE;
  res.status(404).json(DefaultResponse.fail(t("error.route_not_found", locale, { url: req.originalUrl })));
});

app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  const locale = req.locale || DEFAULT_LOCALE;

  if (err instanceof AppError) {
    const message = t(err.messageKey as any, locale, err.params);
    res.status(err.statusCode).json(DefaultResponse.fail(message));
    return;
  }

  const bodyParserError = err as Error & { type?: string };
  if (bodyParserError.type === "entity.too.large") {
    res.status(413).json(DefaultResponse.fail(t("error.payload_too_large", locale, { limit: config.server.jsonBodyLimit })));
    return;
  }
  if (bodyParserError.type === "entity.parse.failed") {
    res.status(400).json(DefaultResponse.fail(t("error.malformed_json", locale)));
    return;
  }

  logger.error(err);
  res.status(500).json(DefaultResponse.fail(t("error.internal_server", locale)));
});

app.listen(config.server.port, async () => {
  await connectDB();
  logger.info(`Server running at port: ${config.server.port}`);
});
