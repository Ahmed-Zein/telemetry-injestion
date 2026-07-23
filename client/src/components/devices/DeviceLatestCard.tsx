// cypod-telemetry
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/i18n";
import { useDeviceLatest } from "@/hooks/useDeviceLatest";
import { TelemetrySummary } from "@/components/TelemetrySummary";
import { StatusBadge } from "@/components/devices/StatusBadge";
import type { Device } from "@/types";

interface DeviceLatestCardProps {
  device: Device;
  className?: string;
}

export function DeviceLatestCard({ device, className }: DeviceLatestCardProps) {
  const { t } = useTranslation();
  const { latest } = useDeviceLatest(device.id);

  if (!latest) {
    return (
      <Card className={`border-gray-200 ${className ?? ""}`}>
        <CardHeader>
          <CardTitle className="text-lg">{t("devices.status")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400">{t("devices.noTelemetry")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-gray-200 ${className ?? ""}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{t("devices.status")}</CardTitle>
          <StatusBadge status={latest.status} />
        </div>
        <p className="text-xs text-gray-400">
          {t("common.cacheSource")}: {latest.cacheSource}
        </p>
      </CardHeader>
      <CardContent>
        <TelemetrySummary latest={latest} showLabel />
      </CardContent>
    </Card>
  );
}
