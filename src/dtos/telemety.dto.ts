// cypod-telemetry
import { z } from "zod";

export const telemetrySchema = z.object({
  battery: z.number().min(0).max(100),
  temperature: z.number(),
  // note: we can Geomety Objcect in the db with a spatial index, but for now we will use two separate fields for latitude and longitude
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  status: z.string().min(1),
  timestamp: z.iso.datetime(),
});

export type TelemetryCreateRequest = z.infer<typeof telemetrySchema>;
