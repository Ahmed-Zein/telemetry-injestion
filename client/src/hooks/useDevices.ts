// cypod-telemetry
import useSWR from "swr";
import { listDevices } from "@/api/devices";
import type { Device } from "@/types";

const devicesKey = "/devices";

export function useDevices() {
  const { data, error, isLoading, mutate } = useSWR<Device[]>(
    devicesKey,
    () => listDevices(),
    { refreshInterval: 5000 }
  );

  return {
    devices: data ?? [],
    error,
    isLoading,
    mutate,
  };
}
