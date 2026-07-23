// cypod-telemetry
import useSWR from "swr";
import { listAlerts } from "@/api/alerts";
import type { Alert } from "@/types";

export function useAlerts() {
  const { data, error, isLoading, mutate } = useSWR<Alert[]>(
    "/alerts",
    () => listAlerts(),
    { refreshInterval: 10000 }
  );

  return {
    alerts: data ?? [],
    error,
    isLoading,
    mutate,
  };
}
