import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { evento } from "@/config/evento";

export function PaginaLegal({
  titulo,
  children,
}: {
  titulo: string;
  children: ReactNode;
}) {
  return (
    <Section className="pt-10 md:pt-16">
      <Container largura="texto" className="flex flex-col gap-10">
        {evento.legal.rascunho && (
          <p className="rounded-control border-2 border-error bg-surface px-4 py-3 text-md leading-[1.4] font-bold text-error">
            Rascunho em revisão jurídica
          </p>
        )}
        <Heading nivel={1}>{titulo}</Heading>
        {children}
        <Text className="border-t border-rule pt-6 text-ink-2">
          Última atualização: {evento.legal.atualizadoEm}
        </Text>
      </Container>
    </Section>
  );
}

export function BlocoLegal({
  titulo,
  children,
}: {
  titulo: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <Heading nivel={2} tamanho="titulo">
        {titulo}
      </Heading>
      {children}
    </section>
  );
}

export function ListaLegal({ itens }: { itens: string[] }) {
  return (
    <ul className="flex list-disc flex-col gap-2 pl-6 text-md leading-[1.6] text-ink marker:text-accent">
      {itens.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
