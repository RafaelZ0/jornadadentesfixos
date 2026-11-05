import { Programacao } from "@/components/Programacao";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";

export function SecaoProgramacao() {
  return (
    <Section fundo="destaque">
      <Container largura="texto" className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <Heading nivel={2}>A programação da Jornada</Heading>
          <Text>
            Antes da aula, 5 lives no YouTube para você ir se preparando. Os
            links de todas chegam no grupo de WhatsApp da Jornada, só para
            inscritos.
          </Text>
        </div>
        <Programacao />
        <div>
          <Button href="#inscricao">Quero participar da Jornada</Button>
        </div>
      </Container>
    </Section>
  );
}
