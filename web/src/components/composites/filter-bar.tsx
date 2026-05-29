import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type FilterSelectOption = {
  value: string;
  label: string;
};

type FilterSelect = {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: FilterSelectOption[];
};

type FilterBarProps = {
  variante?: "full" | "compact"
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };
  selects?: FilterSelect[];
  className?: string
};

export const FilterBar = ({ search, selects, variante, className }: FilterBarProps) => {
  return (
    <Card className={cn(variante === "compact" ? "p-0" : "p-5", "shadow-none border-none", className)} >
      <CardContent className={cn("px-0  flex justify-between")}  >
        {search && (
          <div className="relative flex">
            <Input
              placeholder={search.placeholder ?? "Buscar..."}
              value={search.value}
              onChange={(e) => search.onChange(e.target.value)}
            />
            <div className="absolute right-1 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Search size={15} />
            </div>
          </div>
        )}

        {selects && selects.length > 0 && (
          <div className="flex gap-1">
            {selects.map((select) => (
              <Select
                key={select.label}
                value={select.value}
                onValueChange={select.onValueChange}
              >
                <SelectTrigger className="w-full max-w-48">
                  <SelectValue placeholder={select.label} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{select.label}</SelectLabel>
                    {select.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};