// cypod-telemetry
import useSWR from "swr";
import { listDevices } from "@/api/devices";
import type { Device } from "@/types";

export function useDevice(id: number | string | null) {
  const key = id != null ? "/devices" : null;

  const { data, error, isLoading } = useSWR<Device[]>(
    key,
    () => listDevices(),
    { revalidateOnFocus: false }
  );

  const device = data?.find((d) => String(d.id) === String(id)) ?? null;

  return { device, error, isLoading };
}
