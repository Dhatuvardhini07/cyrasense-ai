import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart2,
  CalendarDays,
  ClipboardList,
  Home,
  Leaf,
  MessageCircle,
  Settings,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/dashboard", icon: Home, label: "Home" },
  { to: "/calendar", icon: CalendarDays, label: "Calendar" },
  { to: "/log", icon: ClipboardList, label: "Log" },
  { to: "/insights", icon: BarChart2, label: "Insights" },
  { to: "/selfcare", icon: Leaf, label: "Self-Care" },
  { to: "/chat", icon: MessageCircle, label: "Chat" },
  { to: "/settings", icon: Settings, label: "Settings" },
] as const;

interface LayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
  className?: string;
}

export function Layout({ children, showNav = true, className }: LayoutProps) {
  const router = useRouterState();
  const currentPath = router.location.pathname;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.97 0.012 75) 0%, oklch(0.95 0.018 65) 100%)",
      }}
    >
      {/* Main scrollable content */}
      <main
        className={cn(
          "flex-1 overflow-y-auto",
          showNav ? "pb-20" : "pb-0",
          className,
        )}
      >
        {children}
      </main>

      {/* Bottom navigation */}
      {showNav && (
        <nav
          className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border"
          style={{
            boxShadow: "0 -4px 20px oklch(0.52 0.15 15 / 0.08)",
          }}
        >
          <div className="flex items-stretch justify-around max-w-lg mx-auto">
            {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
              const isActive =
                currentPath === to ||
                (to !== "/dashboard" && currentPath.startsWith(to));
              return (
                <Link
                  key={to}
                  to={to}
                  data-ocid={`nav-${label.toLowerCase().replace(/\s/g, "-")}`}
                  className={cn(
                    "relative flex flex-col items-center justify-center gap-0.5 px-1 py-2 flex-1 min-w-0 transition-smooth",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon
                    className={cn(
                      "transition-smooth",
                      isActive ? "w-5 h-5" : "w-5 h-5",
                    )}
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                  <span
                    className={cn(
                      "text-[10px] leading-tight font-body truncate w-full text-center",
                      isActive ? "font-semibold" : "font-normal",
                    )}
                  >
                    {label}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
