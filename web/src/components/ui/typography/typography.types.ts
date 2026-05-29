import type { ReactNode } from "react";
import type { VariantProps } from "tailwind-variants";
import { typographyRecipe } from "./typography.recipe";

export type As = "span" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type TypographyProps = VariantProps<typeof typographyRecipe> & {
  as?: As;
  children?: ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<"span">;