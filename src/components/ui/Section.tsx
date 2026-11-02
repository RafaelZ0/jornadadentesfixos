import type { ComponentProps } from "react";

type SectionProps = ComponentProps<"section"> & {
  fundo?: "claro" | "suave" | "destaque";
};

const fundos = {
  claro: "bg-paper text-ink",
  suave: "bg-paper-2 text-ink",
  destaque: "section-field bg-field text-on-field",
};

export function Section({
  fundo = "claro",
  className = "",
  ...props
}: SectionProps) {
  return (
    <section
      className={`py-(--section-gap) ${fundos[fundo]} ${className}`}
      {...props}
    />
  );
}
