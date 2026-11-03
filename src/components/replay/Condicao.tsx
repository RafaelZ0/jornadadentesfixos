import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { evento } from "@/config/evento";

/** Resumo da condição da Jornada, sem preço. Usado em /replay e /vaga até o fim do prazo. */
export function Condicao({ acao }: { acao: ReactNode }) {
  const { condicao, bonus } = evento.replay;

  return (
    <Section fundo="suave">
      <Container largura="texto" className="flex flex-col gap-8">
        <Heading nivel={2} tamanho="titulo">
          {condicao}
        </Heading>

        <div className="flex flex-col gap-5">
          <p className="text-md leading-[1.4] font-bold text-ink">
            E mais {bonus.length} bônus:
          </p>
          <ul className="flex flex-col gap-5">
            {bonus.map((item) => (
              <li key={item} className="flex items-start gap-4">
                <span
                  aria-hidden="true"
                  className="flex size-12 shrink-0 items-center justify-center rounded-full bg-field text-on-field"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="size-7 fill-none stroke-current stroke-[2.5]"
                  >
                    <path
                      d="m5 12.5 4.5 4.5L19 7.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="pt-2 text-lg leading-[1.35] text-ink">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {acao}
      </Container>
    </Section>
  );
}
