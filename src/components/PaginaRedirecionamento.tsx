import { Redirecionamento } from "@/components/Redirecionamento";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import type { EventoGtm } from "@/lib/rastreamento";

function linkValido(destino: string) {
  try {
    return new URL(destino).protocol === "https:";
  } catch {
    return false;
  }
}

/** Página dos links curtos /aula e /live, enviados no grupo. */
export function PaginaRedirecionamento({
  destino,
  evento,
  nome,
}: {
  destino: string;
  evento: EventoGtm;
  /** "aula" ou "live", usado nas frases. */
  nome: "aula" | "live";
}) {
  if (!linkValido(destino)) {
    return (
      <Section className="pt-6 md:pt-14">
        <Container largura="texto" className="flex flex-col gap-4">
          <Heading nivel={1} tamanho="hero">
            O link ainda não foi liberado
          </Heading>
          <Text tipo="abertura">
            O link da {nome} chega no grupo da Jornada pouco antes de começar.
            Fique de olho no seu WhatsApp.
          </Text>
          <div>
            <Button href="/">Ver a página da Jornada</Button>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section className="pt-6 md:pt-14">
      <Redirecionamento destino={destino} evento={evento} />
      <noscript>
        <meta httpEquiv="refresh" content={`1;url=${destino}`} />
      </noscript>
      <Container largura="texto" className="flex flex-col gap-4">
        <Heading nivel={1} tamanho="hero">
          Abrindo a {nome} no YouTube...
        </Heading>
        <Text tipo="abertura">
          Você vai para a {nome} em alguns segundos.
        </Text>
        <Text>Se não abrir em 10 segundos, toque no botão:</Text>
        <div>
          <Button href={destino}>Assistir agora</Button>
        </div>
      </Container>
    </Section>
  );
}
