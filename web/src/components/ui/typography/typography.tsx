import { clsx } from "clsx";
import { typographyRecipe } from "./typography.recipe";
import type { TypographyProps } from "./typography.types";

const Typography = ({
  as,
  children,
  className,
  type,
  ...rest
}: TypographyProps) => {
  const Component = as ?? "span";
  return (
    <Component
      className={clsx(typographyRecipe({ type }), className)}
      {...rest}
    >
      {children}
    </Component>
  );
};

Typography.displayName = "Typography";

export { Typography, type TypographyProps };