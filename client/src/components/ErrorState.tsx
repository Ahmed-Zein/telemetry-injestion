// cypod-telemetry
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n";

interface ErrorStateProps {
  className?: string;
}

export function ErrorState({ className }: ErrorStateProps) {
  const { t } = useTranslation();

  return (
    <div className={`flex flex-col items-center justify-center py-24 ${className ?? ""}`}>
      <p className="text-sm text-gray-500">{t("common.error")}</p>
      <Button
        variant="outline"
        size="sm"
        className="mt-4 border-gray-200"
        onClick={() => window.location.reload()}
      >
        {t("common.retry")}
      </Button>
    </div>
  );
}
