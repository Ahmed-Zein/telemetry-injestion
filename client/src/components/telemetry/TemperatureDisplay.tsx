// cypod-telemetry
import { Thermometer } from "lucide-react";

interface TemperatureDisplayProps {
  value: number;
  showLabel?: boolean;
  className?: string;
}

export function TemperatureDisplay({ value, showLabel = true, className }: TemperatureDisplayProps) {
  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <Thermometer className="h-4 w-4 text-orange-400" />
      {showLabel && <span className="text-sm text-gray-700">{value}°C</span>}
    </div>
  );
}
