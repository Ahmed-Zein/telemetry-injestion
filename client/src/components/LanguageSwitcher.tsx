// cypod-telemetry
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/i18n";
import type { Locale } from "@/types";

const languages: { locale: Locale; label: string }[] = [
  { locale: "en", label: "English" },
  { locale: "ar", label: "عربي" },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-900">
          <Globe className="h-4 w-4" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="border-gray-200">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.locale}
            onClick={() => setLocale(lang.locale)}
            className={locale === lang.locale ? "bg-gray-100" : ""}
          >
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
