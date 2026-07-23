// cypod-telemetry
import { Request } from "express";
import { en } from "./locales/en.js";
import { ar } from "./locales/ar.js";

export const DEFAULT_LOCALE = "en";
const locales = { en, ar };
type MessageKey = keyof typeof en;

export function t(
  key: MessageKey,
  locale: string = DEFAULT_LOCALE,
  params?: Record<string, string | number>,
): string {
  const dict = locales[locale as keyof typeof locales] || locales.en;
  let msg = dict[key] || en[key] || key;

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      msg = msg.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }

  return msg;
}

export function resolveLocale(req: Request): string {
  const header = req.headers["accept-language"];
  if (!header) return DEFAULT_LOCALE;

  const preferred = header.split(",")[0].split(";")[0].trim().toLowerCase();
  if (preferred.startsWith("ar")) return "ar";
  return DEFAULT_LOCALE;
}
