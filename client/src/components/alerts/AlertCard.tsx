// cypod-telemetry
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/i18n";
import type { Alert, AlertSeverity } from "@/types";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";

interface AlertCardProps {
  alert: Alert;
  className?: string;
}

function alertSeverity(type: Alert["type"]): AlertSeverity {
  switch (type) {
    case "LOW_BATTERY":
      return "warning";
    case "HIGH_TEMPERATURE":
      return "critical";
    case "DEVICE_FAULT":
      return "critical";
    case "DEVICE_OFFLINE":
      return "info";
  }
}

function severityIcon(severity: AlertSeverity) {
  switch (severity) {
    case "critical":
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case "warning":
      return <AlertCircle className="h-4 w-4 text-amber-500" />;
    case "info":
      return <Info className="h-4 w-4 text-gray-400" />;
  }
}

function severityBadge(severity: AlertSeverity): string {
  switch (severity) {
    case "critical":
      return "bg-red-50 text-red-700 border-red-200";
    case "warning":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "info":
      return "bg-gray-100 text-gray-500 border-gray-200";
  }
}

export function AlertCard({ alert, className }: AlertCardProps) {
  const { t } = useTranslation();
  const severity = alertSeverity(alert.type);

  return (
    <Card className={`border-gray-200 ${!alert.active ? "opacity-50" : ""} ${className ?? ""}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {severityIcon(severity)}
            <span className="font-semibold text-gray-900">
              {alert.name ?? t("common.error")}
            </span>
          </div>
          <Badge variant="outline" className={`text-xs font-medium ${severityBadge(severity)}`}>
            {severity}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{alert.message}</p>
        <p className="mt-2 text-xs text-gray-400">
          {new Date(alert.triggeredAt).toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
}
