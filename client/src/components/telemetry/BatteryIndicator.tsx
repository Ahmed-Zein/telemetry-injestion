// cypod-telemetry
import { Battery } from "lucide-react";

interface BatteryIndicatorProps {
  level: number;
  showLabel?: boolean;
  className?: string;
}

function batteryColor(level: number): string {
  if (level > 50) return "text-emerald-500";
  if (level > 20) return "text-amber-500";
  return "text-red-500";
}

export function BatteryIndicator({ level, showLabel = true, className }: BatteryIndicatorProps) {
  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <Battery className={`h-4 w-4 ${batteryColor(level)}`} />
      {showLabel && <span className="text-sm text-gray-700">{level}%</span>}
    </div>
  );
}
