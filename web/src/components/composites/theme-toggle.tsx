import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/theme-context";


const themes = [
  { value: "light" as const, icon: Sun, label: "Claro" },
  { value: "dark" as const, icon: Moon, label: "Escuro" },
  { value: "system" as const, icon: Monitor, label: "Sistema" },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <>

      <div className="mb-1 flex space-x-1">
        {themes.map(({ value, icon: Icon, }) => (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            className={cn(
              "flex w-full items-center justify-center gap-2! rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-primary/80 hover:text-primary-foreground/80",
              theme === value && "bg-primary text-primary-foreground font-medium",
            )}
          >
            <Icon className="size-4" />


          </button>
        ))}
      </div>
    </>
  );
}