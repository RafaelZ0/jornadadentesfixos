import { temArquivo } from "@/components/Foto";
import { VideoYoutube } from "@/components/VideoYoutube";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { evento } from "@/config/evento";
import { proporcoes } from "@/lib/video";

export function SecaoVideo() {
  const { id, formato, capa } = evento.videoConvite;
  const titulo = "Um recado do Dr. Pablo para você";

  if (!id && process.env.NODE_ENV === "production") return null;

  return (
    <Section>
      <Container largura="texto" className="flex flex-col gap-6">
        <Heading nivel={2} className="text-center">
          {titulo}
        </Heading>
        {id ? (
          <VideoYoutube
            id={id}
            formato={formato}
            titulo={titulo}
            capa={temArquivo(capa) ? capa : undefined}
            eventoPixel="VideoPlay"
          />
        ) : (
          <div
            className={`mx-auto flex items-center justify-center rounded-card border-4 border-dashed border-error bg-surface p-4 text-center text-lg leading-[1.3] font-bold text-error ${proporcoes[formato]}`}
          >
            VÍDEO DO DR. PABLO: entra aqui
          </div>
        )}
        <div className="text-center">
          <Button href="#inscricao">Quero assistir à aula</Button>
        </div>
      </Container>
    </Section>
  );
}
