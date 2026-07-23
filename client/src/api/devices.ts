// cypod-telemetry
import { api } from "./client";
import type { Device, DeviceLatest, TelemetryHistory } from "@/types";

export async function listDevices(): Promise<Device[]> {
  return api.get("/devices");
}

export async function getDeviceLatest(id: string): Promise<DeviceLatest> {
  return api.get(`/devices/${id}/latest`);
}

export async function getDeviceHistory(
  id: string,
  params: { from?: string; to?: string; page?: number; limit?: number } = {}
): Promise<TelemetryHistory> {
  const searchParams = new URLSearchParams();
  if (params.from) searchParams.set("from", params.from);
  if (params.to) searchParams.set("to", params.to);
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  const query = searchParams.toString();
  return api.get(`/devices/${id}/history${query ? `?${query}` : ""}`);
}

export async function createDevice(name: string): Promise<Device> {
  return api.post("/devices", { name });
}
