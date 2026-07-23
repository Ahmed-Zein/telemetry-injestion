// cypod-telemetry
import { Badge } from "@/components/ui/badge";
import type { DeviceStatus } from "@/types";

interface StatusBadgeProps {
  status: DeviceStatus | string;
  className?: string;
}

function statusStyle(status: string): string {
  switch (status) {
    case "OK":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "FAULT":
      return "bg-red-50 text-red-700 border-red-200";
    case "OFFLINE":
      return "bg-gray-100 text-gray-500 border-gray-200";
    default:
      return "bg-gray-100 text-gray-500 border-gray-200";
  }
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={`text-xs font-medium ${statusStyle(status)} ${className ?? ""}`}
    >
      {status}
    </Badge>
  );
}
