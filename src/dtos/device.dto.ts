// cypod-telemetry
import { z } from "zod";

export const createDeviceSchema = z.object({
  name: z.string().min(1).max(255),
});

export type CreateDeviceRequest = z.infer<typeof createDeviceSchema>;
