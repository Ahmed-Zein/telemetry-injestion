// cypod-telemetry
import { MapPin } from "lucide-react";

interface LocationDisplayProps {
  lat: number | null;
  lng: number | null;
  showLabel?: boolean;
  className?: string;
}

export function LocationDisplay({ lat, lng, showLabel = true, className }: LocationDisplayProps) {
  if (lat == null || lng == null) return null;
  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <MapPin className="h-4 w-4 text-blue-400" />
      {showLabel && (
        <span className="truncate text-sm text-gray-700">
          {lat.toFixed(4)}, {lng.toFixed(4)}
        </span>
      )}
    </div>
  );
}
