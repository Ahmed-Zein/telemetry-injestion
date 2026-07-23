// cypod-telemetry
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FormField } from "@/components/ui/form-field";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/i18n";
import { useForm } from "@/hooks/useForm";
import { register as apiRegister } from "@/api/auth";
import { registerSchema, type RegisterInput } from "@/lib/schemas";

export function RegisterPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();

  const { form, setField, errors, serverError, loading, handleSubmit } = useForm<RegisterInput>({
    schema: registerSchema,
    initialValues: { name: "", email: "", password: "", confirmPassword: "" },
    formatError: t("auth.registerError"),
    onSubmit: async (data) => {
      const response = await apiRegister(data);
      login(response.token, response.user);
      navigate("/devices");
    },
  });

  return (
    <Card className="w-full max-w-sm border-gray-200 shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">{t("auth.registerTitle")}</CardTitle>
        <CardDescription className="text-gray-500">{t("app.title")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {serverError && (
            <Alert variant="destructive">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}
          <FormField
            id="name"
            label={t("auth.name")}
            value={form.name}
            onChange={(v) => setField("name", v)}
            error={errors.name}
          />
          <FormField
            id="email"
            label={t("auth.email")}
            type="email"
            value={form.email}
            onChange={(v) => setField("email", v)}
            error={errors.email}
          />
          <FormField
            id="password"
            label={t("auth.password")}
            type="password"
            value={form.password}
            onChange={(v) => setField("password", v)}
            error={errors.password}
          />
          <FormField
            id="confirmPassword"
            label={t("auth.confirmPassword")}
            type="password"
            value={form.confirmPassword}
            onChange={(v) => setField("confirmPassword", v)}
            error={errors.confirmPassword}
          />
          <Button type="submit" className="w-full bg-gray-900 text-white hover:bg-gray-800" disabled={loading}>
            {loading ? t("common.loading") : t("auth.registerButton")}
          </Button>
          <p className="text-center text-sm text-gray-500">
            {t("auth.hasAccount")}{" "}
            <Link to="/login" className="font-medium text-gray-900 hover:underline">
              {t("auth.login")}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
