// cypod-telemetry
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/i18n";
import { LogOut, LayoutDashboard, Bell } from "lucide-react";

export function NavBar() {
  const { t, dir } = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!isAuthenticated) return null;

  const navItems = [
    { to: "/devices", label: t("nav.dashboard"), icon: LayoutDashboard },
    { to: "/alerts", label: t("nav.alerts"), icon: Bell },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link to="/devices" className="text-lg font-bold tracking-tight text-gray-900">
            {t("app.title")}
          </Link>
          <nav className="flex items-center gap-1" dir={dir}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <Link key={item.to} to={item.to}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className={`gap-2 ${isActive ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-900"}`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-gray-500 sm:inline">
            {user?.email}
          </span>
          <LanguageSwitcher />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-gray-400 hover:text-gray-900"
          >
            <LogOut className="h-4 w-4" />
            <span className="sr-only">{t("nav.logout")}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
