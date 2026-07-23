// cypod-telemetry
import { useState, useCallback, type FormEvent } from "react";
import { type ZodSchema, type ZodError } from "zod";

interface UseFormOptions<T> {
  schema: ZodSchema<T>;
  initialValues: T;
  onSubmit: (data: T) => Promise<void>;
  formatError?: string;
}

interface UseFormReturn<T> {
  form: T;
  setField: (field: keyof T, value: T[keyof T]) => void;
  setForm: React.Dispatch<React.SetStateAction<T>>;
  errors: Record<string, string>;
  serverError: string;
  loading: boolean;
  handleSubmit: (e: FormEvent) => Promise<void>;
}

function zodToFieldErrors(error: ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  error.issues.forEach((issue) => {
    const field = issue.path[0] as string;
    fieldErrors[field] = issue.message;
  });
  return fieldErrors;
}

export function useForm<T extends Record<string, unknown>>({
  schema,
  initialValues,
  onSubmit,
  formatError,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [form, setForm] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const setField = useCallback((field: keyof T, value: T[keyof T]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setErrors({});
      setServerError("");

      const result = schema.safeParse(form);
      if (!result.success) {
        setErrors(zodToFieldErrors(result.error));
        return;
      }

      setLoading(true);
      try {
        await onSubmit(result.data);
      } catch {
        setServerError(formatError ?? "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [form, schema, onSubmit, formatError]
  );

  return { form, setField, setForm, errors, serverError, loading, handleSubmit };
}
