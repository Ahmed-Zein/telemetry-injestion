// cypod-telemetry
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/devices/StatusBadge";
import { BatteryIndicator } from "@/components/telemetry/BatteryIndicator";
import { TemperatureDisplay } from "@/components/telemetry/TemperatureDisplay";
import { LocationDisplay } from "@/components/telemetry/LocationDisplay";
import { useTranslation } from "@/i18n";
import type { TelemetryReading } from "@/types";

interface TelemetryTableProps {
  readings: TelemetryReading[];
  className?: string;
}

export function TelemetryTable({ readings, className }: TelemetryTableProps) {
  const { t } = useTranslation();

  if (readings.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-gray-400">
        {t("devices.noDevices")}
      </div>
    );
  }

  return (
    <Table className={className}>
      <TableHeader>
        <TableRow className="border-gray-200 hover:bg-transparent">
          <TableHead className="text-xs font-medium text-gray-500">{t("devices.status")}</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">{t("devices.battery")}</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">{t("devices.temperature")}</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">{t("devices.location")}</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">{t("devices.lastSeen")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {readings.map((r, idx) => (
          <TableRow key={idx} className="border-gray-100">
            <TableCell>
              <StatusBadge status={r.status} />
            </TableCell>
            <TableCell>
              <BatteryIndicator level={r.battery} />
            </TableCell>
            <TableCell>
              <TemperatureDisplay value={r.temperature} />
            </TableCell>
            <TableCell>
              <LocationDisplay lat={r.lat} lng={r.lng} />
            </TableCell>
            <TableCell className="text-sm text-gray-500">
              {new Date(r.timestamp).toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
