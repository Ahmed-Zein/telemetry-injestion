// cypod-telemetry
import { z } from "zod";

export const telemetryHistoryQuerySchema = z.object({
  from: z.iso.datetime().optional(),
  to: z.iso.datetime().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type TelemetryHistoryQuery = z.infer<typeof telemetryHistoryQuerySchema>;
