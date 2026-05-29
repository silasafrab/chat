import { NavLink, useNavigate } from "react-router";
import {
  MessageSquare,
  Users,
  Link2,
  LogOut,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/contexts/auth-context";
import { ThemeToggle } from "@/components/composites/theme-toggle";



const navItems: { to: string; icon: LucideIcon; label: string }[] = [
  { to: "/dashboard/connections", icon: Link2, label: "Conexões" },
  { to: "/dashboard/contacts", icon: Users, label: "Contatos" },
  { to: "/dashboard/messages", icon: MessageSquare, label: "Mensagens" },
];

export const AppBottomBar = () => {
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
    <aside className="fixed md:hidden  bottom-0  left-0 h-20 w-full z-40   border-sidebar-border bg-background p-0">
      <div className="flex h-full px-4 flex-row items-center justify-between rounded-none bg-primary py-5">


        <nav className="flex flex-row    w-full justify-between gap-3">
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
          <Popover>
            <PopoverTrigger asChild>
              <button type="button" className="cursor-pointer">
                <Avatar className="size-9 ring-2 ring-primary-foreground/20">
                  <AvatarFallback className="bg-primary-foreground/15 text-xs font-medium text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </button>
            </PopoverTrigger>
            <PopoverContent side="top" align="center" className="w-48 p-2">
              <ThemeToggle />
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="size-4" />
                Sair
              </button>
            </PopoverContent>
          </Popover>
        </nav>


      </div>
    </aside>
  );
};
