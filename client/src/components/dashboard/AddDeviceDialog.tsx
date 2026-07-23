// cypod-telemetry
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { useTranslation } from "@/i18n";
import { useForm } from "@/hooks/useForm";
import { createDevice } from "@/api/devices";
import { z } from "zod";

const deviceNameSchema = z.object({
  name: z.string().min(1, "Device name is required"),
});

type DeviceNameInput = z.infer<typeof deviceNameSchema>;

interface AddDeviceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

export function AddDeviceDialog({ open, onOpenChange, onCreated }: AddDeviceDialogProps) {
  const { t } = useTranslation();

  const { form, setField, errors, serverError, loading, handleSubmit } = useForm<DeviceNameInput>({
    schema: deviceNameSchema,
    initialValues: { name: "" },
    formatError: t("devices.addDeviceError"),
    onSubmit: async (data) => {
      await createDevice(data.name.trim());
      setField("name", "");
      onOpenChange(false);
      onCreated();
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-gray-200">
        <DialogHeader>
          <DialogTitle>{t("devices.addDeviceTitle")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {serverError && (
            <Alert variant="destructive">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}
          <FormField
            id="deviceName"
            label={t("devices.deviceName")}
            value={form.name}
            onChange={(v) => setField("name", v)}
            placeholder={t("devices.deviceNamePlaceholder")}
            error={errors.name}
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-gray-200">
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={loading} className="bg-gray-900 text-white hover:bg-gray-800">
              {loading ? t("common.loading") : t("common.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
