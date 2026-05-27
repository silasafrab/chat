import { NavLink, useNavigate } from "react-router";
import {
  MessageSquare,
  Users,
  Link2,
  Inbox,
  LogOut,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

const navItems = [
  {
    to: "/dashboard/messages",
    icon: MessageSquare,
    label: "Mensagens",
  },
  {
    to: "/dashboard/contacts",
    icon: Users,
    label: "Contatos",
  },
  {
    to: "/dashboard/connections",
    icon: Link2,
    label: "Conexões",
  },
];

export const AppSidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const displayName = user?.displayName || user?.email?.split("@")[0] || "Usuário";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
        <Inbox className="size-5 text-sidebar-primary" />
        <span className="font-heading font-medium text-sidebar-foreground">
          Broadcast
        </span>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              cn(
                buttonVariants({ variant: "ghost" }),
                "w-full justify-start gap-2.5",
                isActive &&
                  "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80",
              )
            }
          >
            <Icon className="size-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <footer className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-2.5 rounded-md p-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-sidebar-primary text-sm font-medium text-sidebar-primary-foreground">
            {initials}
          </div>
          <div className="flex-1 truncate text-sm">
            <p className="font-medium text-sidebar-foreground">
              {displayName}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user?.email || ""}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "mt-1 w-full justify-start gap-2.5 text-muted-foreground hover:text-foreground",
          )}
        >
          <LogOut className="size-4" />
          Sair
        </button>
      </footer>
    </aside>
  );
};