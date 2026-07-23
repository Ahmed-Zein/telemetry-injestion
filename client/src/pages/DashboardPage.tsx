// cypod-telemetry
import { useState } from "react";
import { useDevices } from "@/hooks/useDevices";
import { useTranslation } from "@/i18n";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DeviceCard } from "@/components/devices/DeviceCard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AddDeviceDialog } from "@/components/dashboard/AddDeviceDialog";
import { ErrorState } from "@/components/ErrorState";

export function DashboardPage() {
  const { t } = useTranslation();
  const { devices, isLoading, error, mutate } = useDevices();
  const [dialogOpen, setDialogOpen] = useState(false);

  if (error) return <ErrorState />;

  return (
    <div className="space-y-6">
      <DashboardHeader deviceCount={devices.length} onAddDevice={() => setDialogOpen(true)} />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border-gray-200">
              <CardHeader className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : devices.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 py-16 text-center">
          <p className="text-gray-500">{t("devices.noDevices")}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {devices.map((device) => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
      )}

      <AddDeviceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreated={() => mutate()}
      />
    </div>
  );
}
