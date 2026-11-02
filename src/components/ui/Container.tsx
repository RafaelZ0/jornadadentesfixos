import type { ComponentProps } from "react";

type ContainerProps = ComponentProps<"div"> & {
  largura?: "pagina" | "texto";
};

export function Container({
  largura = "pagina",
  className = "",
  ...props
}: ContainerProps) {
  const limite =
    largura === "texto"
      ? "max-w-[calc(var(--measure)+2*var(--gutter))]"
      : "max-w-[calc(var(--container)+2*var(--gutter))]";

  return (
    <div
      className={`mx-auto w-full px-(--gutter) ${limite} ${className}`}
      {...props}
    />
  );
}
