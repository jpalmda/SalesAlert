import { Home, Users, Route, Package, Settings, Bell } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/dashboard", icon: Home, label: "Home" },
  { path: "/clients", icon: Users, label: "Clientes" },
  { path: "/alerts", icon: Bell, label: "Alertas" },
  { path: "/routes", icon: Route, label: "Rotas" },
  { path: "/stock", icon: Package, label: "Estoque", gestorOnly: true },
  { path: "/settings", icon: Settings, label: "Config" },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = useAuth();

  const visibleItems = navItems.filter(item => !item.gestorOnly || role === "gestor");

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur-lg safe-area-bottom">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-1">
        {visibleItems.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 text-[10px] font-medium transition-all",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-xl transition-all",
                active && "bg-accent"
              )}>
                <Icon className="h-5 w-5" />
              </div>
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
