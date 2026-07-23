// cypod-telemetry
import useSWR from "swr";
import { getDeviceLatest } from "@/api/devices";
import type { DeviceLatest } from "@/types";

export function useDeviceLatest(deviceId: number | string | null) {
  const id = deviceId != null ? String(deviceId) : null;
  const { data, error, isLoading, mutate } = useSWR<DeviceLatest>(
    id ? `/devices/${id}/latest` : null,
    () => getDeviceLatest(id!),
    { refreshInterval: 5000 }
  );

  return {
    latest: data ?? null,
    error,
    isLoading,
    mutate,
  };
}
