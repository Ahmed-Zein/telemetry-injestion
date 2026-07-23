// cypod-telemetry
import { BatteryIndicator } from "@/components/telemetry/BatteryIndicator";
import { TemperatureDisplay } from "@/components/telemetry/TemperatureDisplay";
import { LocationDisplay } from "@/components/telemetry/LocationDisplay";
import type { DeviceLatest } from "@/types";

interface TelemetrySummaryProps {
  latest: DeviceLatest;
  showLabel?: boolean;
  className?: string;
}

export function TelemetrySummary({ latest, showLabel = true, className }: TelemetrySummaryProps) {
  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 ${className ?? ""}`}>
      <BatteryIndicator level={latest.battery} showLabel={showLabel} />
      <TemperatureDisplay value={latest.temperature} showLabel={showLabel} />
      <LocationDisplay lat={latest.lat} lng={latest.lng} showLabel={showLabel} />
    </div>
  );
}
