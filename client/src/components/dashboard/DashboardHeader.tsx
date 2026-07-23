// cypod-telemetry
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n";
import { Plus } from "lucide-react";

interface DashboardHeaderProps {
  deviceCount: number;
  onAddDevice: () => void;
  className?: string;
}

export function DashboardHeader({ deviceCount, onAddDevice, className }: DashboardHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className={`flex items-center justify-between ${className ?? ""}`}>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t("devices.title")}</h1>
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="bg-gray-100 text-gray-700">
          {deviceCount}
        </Badge>
        <Button
          size="sm"
          className="gap-1 bg-gray-900 text-white hover:bg-gray-800"
          onClick={onAddDevice}
        >
          <Plus className="h-4 w-4" />
          {t("devices.addDevice")}
        </Button>
      </div>
    </div>
  );
}
