"use client";

import { Contador } from "@/components/Contador";
import { VideoYoutube } from "@/components/VideoYoutube";
import { Condicao } from "@/components/replay/Condicao";
import { useFaseReplay } from "@/components/replay/useFaseReplay";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { evento } from "@/config/evento";
import { porExtenso } from "@/lib/datas";
import { proporcoes } from "@/lib/video";

type ConteudoReplayProps = {
  agoraServidor: number;
  /** Vazio quando o replay já saiu do ar ou o ID ainda não foi cadastrado. */
  videoId: string;
  capaLocal?: string;
};

const fimReplay = porExtenso(evento.aula.fimReplay);
const fimVaga = porExtenso(evento.vaga.prazo);
const titulo = "Replay da aula";

export function ConteudoReplay({
  agoraServidor,
  videoId,
  capaLocal,
}: ConteudoReplayProps) {
  const fase = useFaseReplay(agoraServidor);

  if (fase === "encerrado") return <Encerrado />;

  return (
    <>
      <Section className="pt-6 pb-12 md:pt-14">
        <Container className="flex flex-col gap-8">
          {fase === "no-ar" ? (
            <>
              <div className="mx-auto flex w-full max-w-(--measure) flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <Heading nivel={1}>{titulo}</Heading>
                  <Text tipo="abertura">
                    Disponível até {fimReplay.dia}, {fimReplay.data}, às{" "}
                    {fimReplay.hora}
                  </Text>
                </div>
                <Contador
                  ate={evento.aula.fimReplay}
                  rotulo="O replay sai do ar em"
                />
              </div>
              <Video id={videoId} capaLocal={capaLocal} />
              <div className="mx-auto w-full max-w-(--measure)">
                <BotaoVaga />
              </div>
            </>
          ) : (
            <div className="mx-auto flex w-full max-w-(--measure) flex-col gap-3">
              <Heading nivel={1}>O replay foi encerrado</Heading>
              <Text tipo="abertura">
                Você ainda pode marcar sua avaliação até {fimVaga.dia},{" "}
                {fimVaga.data}, às {fimVaga.hora}.
              </Text>
              <div className="pt-5">
                <BotaoVaga />
              </div>
            </div>
          )}
        </Container>
      </Section>

      <Condicao acao={<BotaoVaga />} />
    </>
  );
}

function Video({ id, capaLocal }: { id: string; capaLocal?: string }) {
  const formato = "16:9";

  if (!id) {
    return (
      <div
        className={`mx-auto flex items-center justify-center rounded-card bg-paper-3 p-6 text-center ${proporcoes[formato]}`}
      >
        <p className="max-w-[24ch] font-display text-title leading-[1.25] font-semibold text-ink">
          {process.env.NODE_ENV === "production"
            ? "O replay aparece aqui logo depois da aula"
            : "REPLAY: preencha NEXT_PUBLIC_REPLAY_VIDEO_ID"}
        </p>
      </div>
    );
  }

  const miniatura = (tamanho: string) =>
    `https://i.ytimg.com/vi/${encodeURIComponent(id)}/${tamanho}.jpg`;

  return (
    <VideoYoutube
      id={id}
      formato={formato}
      titulo={`${titulo}: ${evento.aula.titulo}`}
      capa={capaLocal ?? miniatura("maxresdefault")}
      capaReserva={miniatura("hqdefault")}
      sizes="(min-width: 1024px) 860px, calc(100vw - 40px)"
      eventoPixel="ReplayPlay"
    />
  );
}

function BotaoVaga() {
  return (
    <Button
      href={evento.rotas.vaga}
      className="min-h-20! px-4! text-lg! sm:w-full!"
    >
      Quero minha vaga de avaliação
    </Button>
  );
}

function Encerrado() {
  const { clinicaE164, clinicaExibicao } = evento.whatsapp;
  const linkClinica = `https://wa.me/${clinicaE164}`;

  return (
    <Section className="pt-6 md:pt-14">
      <Container largura="texto" className="flex flex-col gap-3">
        <Heading nivel={1}>O replay foi encerrado</Heading>
        <Text tipo="abertura">
          Para falar com a clínica, chame no WhatsApp{" "}
          <a
            href={linkClinica}
            target="_blank"
            rel="noopener"
            className="font-bold whitespace-nowrap text-accent underline underline-offset-4"
          >
            {clinicaExibicao}
          </a>
          .
        </Text>
      </Container>
    </Section>
  );
}
