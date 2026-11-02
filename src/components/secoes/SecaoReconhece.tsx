import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";

const sinais = [
  "Evita sorrir em fotos ou cobre a boca quando ri",
  "A dentadura solta ou machuca na hora de comer",
  "Deixou de comer o que gosta",
  "Tem vergonha de conversar de perto",
  "Já pensou em implante, mas achou que não era para você",
];

export function SecaoReconhece() {
  return (
    <Section>
      <Container className="grid grid-cols-[minmax(0,1fr)] gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
        <Heading nivel={2}>Você se reconhece?</Heading>
        <div>
          <ul className="flex flex-col gap-5">
            {sinais.map((sinal) => (
              <li key={sinal} className="flex items-start gap-4">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="size-8 shrink-0 fill-none stroke-action stroke-3 [stroke-linecap:round] [stroke-linejoin:round]"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span className="text-lg leading-[1.4] text-ink">{sinal}</span>
              </li>
            ))}
          </ul>
          <Text tipo="abertura" className="mt-8 font-bold">
            Se você marcou pelo menos um, esta aula foi feita para você.
          </Text>
          <div className="mt-8">
            <Button href="#inscricao">Esta aula é para mim</Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
