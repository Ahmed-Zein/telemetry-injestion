// cypod-telemetry
import { useAlerts } from "@/hooks/useAlerts";
import { useTranslation } from "@/i18n";
import { Badge } from "@/components/ui/badge";
import { AlertCard } from "@/components/alerts/AlertCard";
import { ErrorState } from "@/components/ErrorState";

export function AlertsPage() {
  const { t } = useTranslation();
  const { alerts, isLoading, error } = useAlerts();

  if (error) return <ErrorState />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t("alerts.title")}</h1>
        <Badge variant="secondary" className="bg-gray-100 text-gray-700">
          {alerts.filter((a) => a.active).length}
        </Badge>
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-sm text-gray-500">{t("common.loading")}</div>
      ) : alerts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 py-16 text-center">
          <p className="text-gray-500">{t("alerts.noAlerts")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      )}
    </div>
  );
}
