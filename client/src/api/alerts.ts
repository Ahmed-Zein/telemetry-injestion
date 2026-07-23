// cypod-telemetry
import { api } from "./client";
import type { Alert } from "@/types";

export async function listAlerts(): Promise<Alert[]> {
  return api.get("/alerts");
}
