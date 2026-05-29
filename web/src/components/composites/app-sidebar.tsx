import { NavLink, useNavigate } from "react-router";
import {
  MessageSquare,
  Users,
  Link2,
  LogOut,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/composites/logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth-context";

export const SIDEBAR_WIDTH_CLASS = "pl-28";

const navItems: { to: string; icon: LucideIcon; label: string }[] = [
  { to: "/dashboard/connections", icon: Link2, label: "Conexões" },
  { to: "/dashboard/contacts", icon: Users, label: "Contatos" },
  { to: "/dashboard/messages", icon: MessageSquare, label: "Mensagens" },
];

export const AppSidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const displayName =
    user?.displayName || user?.email?.split("@")[0] || "Usuário";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-28 border-r border-sidebar-border bg-background p-3">
      <div className="flex h-full flex-col items-center justify-between rounded-2xl bg-primary py-5">
        <NavLink
          to="/dashboard/messages"
          title="Início"
          className="flex items-center justify-center rounded-xl p-1 transition-opacity hover:opacity-90"
        >
          <Logo className="size-10" aria-hidden />
        </NavLink>

        <nav className="flex flex-col gap-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              title={label}
              className={({ isActive }) =>
                cn(
                  "flex size-10 items-center justify-center rounded-xl text-primary-foreground/70 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground",
                  isActive &&
                    "bg-primary-foreground text-primary shadow-sm",
                )
              }
            >
              <Icon className="size-5" />
              <span className="sr-only">{label}</span>
            </NavLink>
          ))}
        </nav>

        <footer className="flex flex-col items-center gap-3">
          <Avatar className="size-9 ring-2 ring-primary-foreground/20">
            <AvatarFallback className="bg-primary-foreground/15 text-xs font-medium text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <button
            type="button"
            onClick={handleLogout}
            title="Sair"
            className="flex size-10 items-center justify-center rounded-xl text-primary-foreground/70 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <LogOut className="size-5" />
            <span className="sr-only">Sair</span>
          </button>
        </footer>
      </div>
    </aside>
  );
};
