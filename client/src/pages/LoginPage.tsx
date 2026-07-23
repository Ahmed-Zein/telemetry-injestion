// cypod-telemetry
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FormField } from "@/components/ui/form-field";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/i18n";
import { useForm } from "@/hooks/useForm";
import { login as apiLogin } from "@/api/auth";
import { loginSchema, type LoginInput } from "@/lib/schemas";

export function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();

  const { form, setField, errors, serverError, loading, handleSubmit } = useForm<LoginInput>({
    schema: loginSchema,
    initialValues: { email: "", password: "" },
    formatError: t("auth.loginError"),
    onSubmit: async (data) => {
      const response = await apiLogin(data);
      login(response.token, response.user);
      navigate("/devices");
    },
  });

  return (
    <Card className="w-full max-w-sm border-gray-200 shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">{t("auth.loginTitle")}</CardTitle>
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
            id="email"
            label={t("auth.email")}
            type="email"
            value={form.email}
            onChange={(v) => setField("email", v)}
            placeholder="admin@cypodo.dev"
            error={errors.email}
          />
          <FormField
            id="password"
            label={t("auth.password")}
            type="password"
            value={form.password}
            onChange={(v) => setField("password", v)}
            placeholder="password"
            error={errors.password}
          />
          <Button type="submit" className="w-full bg-gray-900 text-white hover:bg-gray-800" disabled={loading}>
            {loading ? t("common.loading") : t("auth.loginButton")}
          </Button>
          <p className="text-center text-sm text-gray-500">
            {t("auth.noAccount")}{" "}
            <Link to="/register" className="font-medium text-gray-900 hover:underline">
              {t("auth.register")}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
