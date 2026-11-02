import type { ComponentProps } from "react";

type TextProps = ComponentProps<"p"> & {
  tipo?: "corpo" | "abertura" | "apoio";
};

const tipos = {
  corpo: "text-md leading-[1.6] text-ink",
  abertura: "text-lg leading-[1.5] text-ink",
  apoio: "text-sm leading-[1.5] text-ink-2",
};

export function Text({ tipo = "corpo", className = "", ...props }: TextProps) {
  return (
    <p className={`max-w-[60ch] ${tipos[tipo]} ${className}`} {...props} />
  );
}
