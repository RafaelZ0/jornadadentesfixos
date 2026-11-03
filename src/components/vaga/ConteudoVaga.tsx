"use client";

import { useEffect, useRef, useState } from "react";
import { IconeWhatsapp } from "@/components/IconeWhatsapp";
import { useVagasEncerradas } from "@/components/replay/useFaseReplay";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { FormVaga } from "@/components/vaga/FormVaga";
import { evento } from "@/config/evento";
import { porExtenso } from "@/lib/datas";
import { rastrear } from "@/lib/pixel";

// Datas sem hora: meio-dia evita cair no dia anterior por causa do fuso.
const avaliacao = {
  inicio: porExtenso(`${evento.avaliacaoPresencial.inicio}T12:00:00-03:00`),
  fim: porExtenso(`${evento.avaliacaoPresencial.fim}T12:00:00-03:00`),
};
const { retornoMinutos, mesListaDeEspera } = evento.vaga;

type Confirmacao = { eventId: string; listaDeEspera: boolean };

export function ConteudoVaga({ agoraServidor }: { agoraServidor: number }) {
  const encerrada = useVagasEncerradas(agoraServidor);
  const [confirmacao, setConfirmacao] = useState<Confirmacao | null>(null);

  if (confirmacao) return <Recebido {...confirmacao} />;

  return (
    <Section className="pt-6 md:pt-14">
      <Container largura="texto" className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <Heading nivel={1}>
            {encerrada
              ? "As vagas da Jornada foram encerradas"
              : "Garanta sua vaga de avaliação da Jornada"}
          </Heading>
          <Text tipo="abertura">
            {encerrada
              ? `Quer saber quando abrirmos as vagas de ${mesListaDeEspera}? Entre na lista de espera e avisamos você.`
              : `Preencha abaixo e nossa equipe te liga em até ${retornoMinutos} minutos para marcar o melhor dia, entre ${avaliacao.inicio.data} e ${avaliacao.fim.data}.`}
          </Text>
        </div>

        <FormVaga
          // Troca de fase com a página aberta: o formulário recomeça com o botão certo.
          key={encerrada ? "espera" : "vaga"}
          rotuloBotao={encerrada ? "Entrar na lista de espera" : "Quero minha vaga"}
          aoConfirmar={setConfirmacao}
        />

        <Alternativa encerrada={encerrada} />
      </Container>
    </Section>
  );
}

function Alternativa({ encerrada }: { encerrada: boolean }) {
  const { whatsappComercialE164, mensagemWhatsapp, mensagemListaDeEspera } = evento.vaga;
  const numero = whatsappComercialE164 || evento.whatsapp.clinicaE164;
  const mensagem = encerrada ? mensagemListaDeEspera : mensagemWhatsapp;
  const link = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

  return (
    <div className="flex flex-col gap-3 border-t-2 border-paper-3 pt-8">
      <p className="text-lg leading-[1.35] font-bold text-ink">
        Prefere chamar no WhatsApp?
      </p>
      <a
        href={link}
        target="_blank"
        rel="noopener"
        onClick={() => rastrear("track", "Contact")}
        className="inline-flex min-h-14 items-center gap-3 self-start rounded-control text-md font-bold text-accent underline underline-offset-4 hover:text-ink"
      >
        <IconeWhatsapp />
        Chamar no WhatsApp
      </a>
    </div>
  );
}

function Recebido({ eventId, listaDeEspera }: Confirmacao) {
  const titulo = useRef<HTMLHeadingElement>(null);
  const { clinicaExibicao } = evento.whatsapp;

  useEffect(() => {
    window.scrollTo({ top: 0 });
    titulo.current?.focus();
    // Mesmo event_id do servidor: a Meta conta um agendamento só, mesmo chegando pelos dois caminhos.
    if (!listaDeEspera) rastrear("track", "Schedule", {}, { eventID: eventId });
  }, [eventId, listaDeEspera]);

  return (
    <Section className="pt-6 md:pt-14">
      <Container largura="texto" className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <Heading nivel={1} ref={titulo} tabIndex={-1} className="outline-none">
            {listaDeEspera ? "Pronto, você está na lista de espera" : "Recebemos!"}
          </Heading>
          <Text tipo="abertura">
            {listaDeEspera
              ? `Quando abrirmos as vagas de ${mesListaDeEspera}, nossa equipe fala com você.`
              : `Nossa equipe vai te ligar em até ${retornoMinutos} minutos.`}
          </Text>
        </div>

        <div className="flex flex-col gap-4 rounded-card bg-paper-2 p-5 sm:p-6">
          <p className="text-md leading-[1.5] text-ink">
            Salve o número da clínica para reconhecer a nossa ligação:
          </p>
          <p className="font-display text-section leading-[1.1] font-semibold whitespace-nowrap text-ink tabular-nums">
            {clinicaExibicao}
          </p>
          <Button href="/contato.vcf" className="sm:w-full!">
            Salvar o número no celular
          </Button>
        </div>
      </Container>
    </Section>
  );
}
