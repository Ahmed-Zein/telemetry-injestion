// cypod-telemetry
import useSWR from "swr";
import { getDeviceHistory } from "@/api/devices";
import type { TelemetryHistory } from "@/types";

interface HistoryParams {
  deviceId: number | string | null;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export function useTelemetryHistory({
  deviceId,
  from,
  to,
  page = 1,
  limit = 20,
}: HistoryParams) {
  const id = deviceId != null ? String(deviceId) : null;
  const key = id
    ? `/devices/${id}/history?from=${from ?? ""}&to=${to ?? ""}&page=${page}&limit=${limit}`
    : null;

  const { data, error, isLoading, mutate } = useSWR<TelemetryHistory>(
    key,
    () => getDeviceHistory(id!, { from, to, page, limit }),
    { refreshInterval: 10000 }
  );

  return {
    history: data ?? { items: [], totalPages: 1, pageNumber: 1, pageSize: 20, hasNext: false, hasPrevious: false },
    error,
    isLoading,
    mutate,
  };
}
