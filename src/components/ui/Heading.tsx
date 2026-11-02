import type { ComponentProps } from "react";

type HeadingProps = ComponentProps<"h1"> & {
  nivel?: 1 | 2 | 3;
  tamanho?: "convite" | "hero" | "manchete" | "secao" | "titulo";
};

const tamanhos = {
  convite: "text-invite leading-[1.04]",
  hero: "text-hero leading-[1.1]",
  manchete: "text-display leading-[1.12]",
  secao: "text-section leading-[1.18]",
  titulo: "text-title leading-[1.25]",
};

const padrao = { 1: "manchete", 2: "secao", 3: "titulo" } as const;

export function Heading({
  nivel = 2,
  tamanho,
  className = "",
  ...props
}: HeadingProps) {
  const Tag = `h${nivel}` as const;

  return (
    <Tag
      className={`font-display font-semibold tracking-display ${tamanhos[tamanho ?? padrao[nivel]]} ${className}`}
      {...props}
    />
  );
}
