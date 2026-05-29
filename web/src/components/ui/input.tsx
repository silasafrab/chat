import * as React from "react";

import { cn } from "@/lib/utils";
import { formatString, unformatString } from "@/utils/format-string";
import type { FormatType } from "@/utils/format-string";

function Input({
  className,
  type,
  mask,
  onChange,
  value,
  ...props
}: React.ComponentProps<"input"> & {
  mask?: FormatType;
}) {
  const [displayValue, setDisplayValue] = React.useState(() => {
    if (mask && typeof value === "string") return formatString(value, mask);
    return value ?? "";
  });

  React.useEffect(() => {
    if (mask && typeof value === "string") {
      setDisplayValue(formatString(value, mask));
    } else {
      setDisplayValue(value ?? "");
    }
  }, [value, mask]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (mask) {
      const raw = unformatString(e.target.value);
      const formatted = formatString(raw, mask);
      setDisplayValue(formatted);

      // Dispatch to react-hook-form with raw digits
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value",
      )?.set;
      nativeSetter?.call(e.target, raw);
      onChange?.(e);
      return;
    }

    setDisplayValue(e.target.value);
    onChange?.(e);
  };

  return (
    <input
      type={type}
      data-slot="input"
      value={displayValue}
      onChange={handleChange}
      className={cn(
        "h-9 w-full min-w-0 rounded-3xl border border-transparent bg-input/50 px-3 py-1 text-base transition-[color,box-shadow,background-color] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className,
      )}
      {...props}
    />
  );
}

export { Input };