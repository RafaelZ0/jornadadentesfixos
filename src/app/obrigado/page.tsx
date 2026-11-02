import type { Metadata } from "next";
import { Suspense } from "react";
import { Contador } from "@/components/Contador";
import { BotaoGrupo } from "@/components/obrigado/BotaoGrupo";
import { EventoLead } from "@/components/obrigado/EventoLead";
import { TituloObrigado } from "@/components/obrigado/TituloObrigado";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { evento } from "@/config/evento";
import { dataDaAula, diaDaAula, horaDaAula } from "@/lib/datas";

export const metadata: Metadata = {
  title: "Falta só 1 passo",
  robots: { index: false, follow: false },
};

const PROGRESSO = 90;

const passos = [
  "Toque no botão verde",
  "Toque em “Entrar na comunidade”",
  "Pronto, você vai receber o link da aula ali",
];

export default function ObrigadoPage() {
  const { clinicaE164, clinicaExibicao } = evento.whatsapp;
  const linkClinica = `https://wa.me/${clinicaE164}?text=${encodeURIComponent("AULA")}`;

  return (
    <>
      <Suspense>
        <EventoLead />
      </Suspense>

      <Section className="pt-6 pb-12 md:pt-14">
        <Container largura="texto" className="flex flex-col gap-4">
          <Suspense
            fallback={
              <Heading nivel={1} tamanho="hero">
                Falta só 1 passo!
              </Heading>
            }
          >
            <TituloObrigado />
          </Suspense>

          <div
            role="progressbar"
            aria-label="Sua inscrição"
            aria-valuenow={PROGRESSO}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-4 overflow-hidden rounded-full bg-paper-3"
          >
            <div
              className="h-full rounded-full bg-action"
              style={{ width: `${PROGRESSO}%` }}
            />
          </div>

          <Text>
            O link da aula vai ser enviado SOMENTE no grupo da Jornada. Toque no
            botão verde para entrar agora.
          </Text>

          <BotaoGrupo />
        </Container>
      </Section>

      <Section fundo="suave">
        <Container largura="texto" className="flex flex-col gap-10">
          <ol className="flex flex-col gap-5">
            {passos.map((passo, indice) => (
              <li key={passo} className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="flex size-14 shrink-0 items-center justify-center rounded-full bg-field font-display text-title leading-none font-semibold text-on-field"
                >
                  {indice + 1}
                </span>
                <span className="text-lg leading-[1.35] text-ink">{passo}</span>
              </li>
            ))}
          </ol>

          <div className="flex flex-col gap-3">
            <Contador />
            <Text tipo="abertura" className="font-display font-semibold">
              {diaDaAula}, {dataDaAula}, às {horaDaAula}
            </Text>
          </div>

          <BotaoGrupo />

          <Text tipo="apoio">
            Se o botão não abrir, salve nosso número{" "}
            <a
              href={linkClinica}
              target="_blank"
              rel="noopener"
              className="font-bold whitespace-nowrap text-accent underline underline-offset-4"
            >
              {clinicaExibicao}
            </a>{" "}
            e mande a palavra AULA.
          </Text>
        </Container>
      </Section>
    </>
  );
}
