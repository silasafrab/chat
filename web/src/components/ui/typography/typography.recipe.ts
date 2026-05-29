import { tv } from "tailwind-variants";

export const typographyRecipe = tv({
  base: "block",
  variants: {
    type: {
      display:
        "text-[2.4375rem] md:text-[3.25rem] lg:text-[4rem] leading-[110%]  font-heading font-bold", // 39, 52, 64
      "heading-xl":
        "text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-bold", // 24, 32, 40
      "heading-l":
        "text-[1.5rem] md:text-[1.5rem] lg:text-[2rem] font-heading font-bold", // 18, 24, 32
      "heading-m":
        "text-[1.25rem] md:text-[1.25rem] lg:text-[1.5rem] font-heading font-bold", // 16, 20, 24
      "heading-s":
        "text-[0.75rem] md:text-[1.125rem] lg:text-[1.25rem] font-title", // 12, 18, 20
      "body-l": "text-[0.75rem] md:text-[1rem] lg:text-[1.125rem] font-body", // 12, 16, 18
      "body-m": "text-[0.625rem] md:text-[0.875rem] lg:text-[1rem] font-body", // 10, 14, 16
      "body-s": "text-[0.75rem] md:text-[0.75rem] lg:text-[0.875rem] font-body", // 8, 12, 14
      "body-xs":
        "text-[0.625rem] md:text-[0.625rem] lg:text-[0.75rem] font-body", // 4, 10, 12
      caption: "text-[0.65rem] md:text-[0.65rem] lg:text-[0.65rem] font-body", // 6, 8, 10
      small: "text-[0.8125rem] md:text-[0.875rem] lg:text-[0.875rem] font-body", // 13, 14, 14 — label size
    },
  },
});
