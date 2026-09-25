// cypod-telemetry
import { z } from "zod";
import { config } from "../config/index.js";

const MAX_BATCH_SIZE = config.telemetry.maxBatchSize;

export const singleTelemetrySchema = z.object({
  battery: z.number().min(0).max(100),
  temperature: z.number(),
  // note: we can Geomety Objcect in the db with a spatial index, but for now we will use two separate fields for latitude and longitude
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  status: z.string().min(1).max(64),
  timestamp: z.iso.datetime(),
});

export const telemetryIngestionSchema = z.union([
  singleTelemetrySchema,
  z
    .array(singleTelemetrySchema)
    .min(1, "at least 1 reading is required")
    .max(
      MAX_BATCH_SIZE,
      `at most ${MAX_BATCH_SIZE} readings per request — split larger batches into chunks of ${MAX_BATCH_SIZE} or fewer`,
    ),
]);

export const telemetrySchema = telemetryIngestionSchema;

export type TelemetryItemsRequest = z.infer<typeof telemetryIngestionSchema>;
