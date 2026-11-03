"use client";

import { IconeWhatsapp } from "@/components/IconeWhatsapp";
import { Condicao } from "@/components/replay/Condicao";
import { useFaseReplay } from "@/components/replay/useFaseReplay";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { evento } from "@/config/evento";
import { porExtenso } from "@/lib/datas";
import { rastrear } from "@/lib/pixel";

const fimVaga = porExtenso(evento.replay.fimVaga);
// Datas sem hora: meio-dia evita cair no dia anterior por causa do fuso.
const avaliacao = {
  inicio: porExtenso(`${evento.avaliacaoPresencial.inicio}T12:00:00-03:00`),
  fim: porExtenso(`${evento.avaliacaoPresencial.fim}T12:00:00-03:00`),
};
const cidade = evento.clinica.endereco.cidade;

const passos = [
  "Toque no botão verde",
  "Envie a mensagem que já vem escrita",
  "Nossa equipe responde e combina o melhor dia com você",
];

export function ConteudoVaga({ agoraServidor }: { agoraServidor: number }) {
  const fase = useFaseReplay(agoraServidor);
  const noPrazo = fase !== "encerrado";
  const { mensagemVaga, mensagemDepoisDoPrazo } = evento.replay;
  const botao = (
    <BotaoWhatsapp mensagem={noPrazo ? mensagemVaga : mensagemDepoisDoPrazo} />
  );

  return (
    <>
      <Section className="pt-6 md:pt-14">
        <Container largura="texto" className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <Heading nivel={1}>
              {noPrazo ? "Sua vaga de avaliação" : "O prazo da Jornada terminou"}
            </Heading>
            <Text tipo="abertura">
              {noPrazo
                ? `A avaliação é presencial, na clínica, em ${cidade}, de ${avaliacao.inicio.data} a ${avaliacao.fim.data}.`
                : `A condição de lançamento valia para quem marcou até ${fimVaga.data}. Você ainda pode marcar uma avaliação com a clínica pelo WhatsApp.`}
            </Text>
          </div>

          <div className="flex flex-col gap-3">
            {botao}
            {noPrazo && (
              <Text className="font-bold">
                Marque até {fimVaga.dia}, {fimVaga.data}, às {fimVaga.hora}.
              </Text>
            )}
          </div>

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
        </Container>
      </Section>

      {noPrazo && <Condicao acao={botao} />}
    </>
  );
}

function BotaoWhatsapp({ mensagem }: { mensagem: string }) {
  const link = `https://wa.me/${evento.whatsapp.clinicaE164}?text=${encodeURIComponent(mensagem)}`;

  return (
    <Button
      href={link}
      aoAbrirLink={() => rastrear("track", "Contact")}
      novaAba
      className="min-h-20! px-4! text-lg! sm:w-full!"
    >
      <IconeWhatsapp />
      Marcar pelo WhatsApp
    </Button>
  );
}
