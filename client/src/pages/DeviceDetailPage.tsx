// cypod-telemetry
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTelemetryHistory } from "@/hooks/useTelemetryHistory";
import { useDevice } from "@/hooks/useDevice";
import { useTranslation } from "@/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { DeviceLatestCard } from "@/components/devices/DeviceLatestCard";
import { TelemetryTable } from "@/components/telemetry/TelemetryTable";
import { ErrorState } from "@/components/ErrorState";

export function DeviceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const fromParam = from || undefined;
  const toParam = to || undefined;

  const { device } = useDevice(id ?? null);

  const { history, isLoading: historyLoading } = useTelemetryHistory({
    deviceId: id ?? null,
    from: fromParam,
    to: toParam,
    page,
  });

  if (!id) return <ErrorState />;

  return (
    <div className="space-y-6">
      <Link to="/devices">
        <Button variant="ghost" size="sm" className="gap-2 text-gray-500 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" />
          {t("devices.back")}
        </Button>
      </Link>

      <h1 className="text-2xl font-bold tracking-tight text-gray-900">{device?.name ?? id}</h1>

      {device && <DeviceLatestCard device={device} />}

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg">{t("devices.history")}</CardTitle>
          <div className="flex flex-wrap gap-4 mt-2">
            <div className="space-y-1.5">
              <Label htmlFor="from" className="text-xs font-medium text-gray-500">{t("common.from")}</Label>
              <Input
                id="from"
                type="datetime-local"
                value={from}
                onChange={(e) => { setFrom(e.target.value); setPage(1); }}
                className="border-gray-200"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="to" className="text-xs font-medium text-gray-500">{t("common.to")}</Label>
              <Input
                id="to"
                type="datetime-local"
                value={to}
                onChange={(e) => { setTo(e.target.value); setPage(1); }}
                className="border-gray-200"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {historyLoading ? (
            <div className="py-8 text-center text-sm text-gray-500">{t("common.loading")}</div>
          ) : (
            <>
              <TelemetryTable readings={history.items} />
              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="text-xs text-gray-500">
                  {t("common.page")} {history.pageNumber} {t("common.of")} {history.totalPages}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!history.hasPrevious}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="border-gray-200"
                  >
                    {t("common.previous")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!history.hasNext}
                    onClick={() => setPage((p) => p + 1)}
                    className="border-gray-200"
                  >
                    {t("common.next")}
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
