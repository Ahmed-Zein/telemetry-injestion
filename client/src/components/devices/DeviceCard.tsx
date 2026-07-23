// cypod-telemetry
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/devices/StatusBadge";
import { TelemetrySummary } from "@/components/TelemetrySummary";
import { useDeviceLatest } from "@/hooks/useDeviceLatest";
import { useTranslation } from "@/i18n";
import type { Device } from "@/types";

interface DeviceCardProps {
  device: Device;
  className?: string;
}

export function DeviceCard({ device, className }: DeviceCardProps) {
  const { t } = useTranslation();
  const { latest } = useDeviceLatest(device.id);

  return (
    <Link to={`/devices/${device.id}`}>
      <Card className={`group cursor-pointer border-gray-200 transition-all hover:border-gray-300 hover:shadow-md ${className ?? ""}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-gray-900 group-hover:text-black">{device.name}</h3>
              <p className="text-xs text-gray-400">ID {device.id}</p>
            </div>
            {device.status && <StatusBadge status={device.status} />}
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {latest ? (
            <>
              <TelemetrySummary latest={latest} showLabel />
              <p className="text-xs text-gray-400">
                {t("devices.lastSeen")}: {new Date(latest.timestamp).toLocaleString()}
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-400">{t("devices.noTelemetry")}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
