import type { ReactNode } from "react";
import { Contador } from "@/components/Contador";
import { Programacao } from "@/components/Programacao";
import { AvisoSeguranca } from "@/components/obrigado/AvisoSeguranca";
import { BotaoGrupo } from "@/components/obrigado/BotaoGrupo";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { evento } from "@/config/evento";
import { dataDaAula, diaDaAula, horaDaAula } from "@/lib/datas";

const passos = [
  "Toque no botão verde",
  "Toque em “Entrar na comunidade”",
  "Pronto, você vai receber o link da aula ali",
];

/** Corpo comum do /obrigado (logo depois da inscrição) e do /grupo (remarketing de quem não entrou). */
export function ConteudoGrupo({
  topo,
  antesDosPassos,
}: {
  topo: ReactNode;
  /** Abre a segunda seção, abaixo do botão verde: fora da primeira dobra do celular. */
  antesDosPassos?: ReactNode;
}) {
  const { clinicaE164, clinicaExibicao } = evento.whatsapp;
  const linkClinica = `https://wa.me/${clinicaE164}?text=${encodeURIComponent("AULA")}`;

  return (
    <>
      <Section className="pt-6 pb-12 md:pt-14">
        <Container largura="texto" className="flex flex-col gap-4">
          {topo}

          <Text>
            O link da aula vai ser enviado SOMENTE no grupo da Jornada. Toque no
            botão verde para entrar agora.
          </Text>

          <BotaoGrupo />
        </Container>
      </Section>

      <Section fundo="suave">
        <Container largura="texto" className="flex flex-col gap-10">
          {antesDosPassos}
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

          <AvisoSeguranca />

          <div className="flex flex-col gap-3">
            <Contador />
            <Text tipo="abertura" className="font-display font-semibold">
              {diaDaAula}, {dataDaAula}, às {horaDaAula}
            </Text>
          </div>

          <div className="flex flex-col gap-4">
            <Heading nivel={2} tamanho="titulo">
              O que vai chegar no grupo
            </Heading>
            <Programacao />
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
