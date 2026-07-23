// cypod-telemetry
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { config } from "../../config/index.js";
import { logger } from "../../utils/logger.js";

let dbClient: ReturnType<typeof drizzle> | null = null;

export const connectDB = async () => {
  if (dbClient) return dbClient;

  const pool = new Pool({ connectionString: config.database.url });

  dbClient = drizzle({ client: pool });

  logger.info("Drizzle ORM connected to PostgreSQL");
  return dbClient;
};

export const getDb = () => {
  if (!dbClient)
    throw new Error("Database not initialized. Call connectDB() first.");
  return dbClient;
};

export const closeDB = async () => {
  // note: will review it later
};
