import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { evento } from "@/config/evento";

export const metadata: Metadata = {
  title: "Inscrição recebida",
  robots: { index: false, follow: false },
};

export default function ObrigadoPage() {
  const { grupoUrl } = evento.whatsapp;

  return (
    <Section>
      <Container largura="texto" className="flex flex-col gap-6">
        <Heading nivel={1}>Falta só entrar no grupo</Heading>
        <Text tipo="abertura">
          Os links da aula chegam na comunidade do WhatsApp.
        </Text>
        <div>
          <Button href={grupoUrl || undefined} disabled={!grupoUrl}>
            Entrar no grupo do WhatsApp
          </Button>
        </div>
      </Container>
    </Section>
  );
}
