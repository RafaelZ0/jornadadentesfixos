import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";

const passos = [
  {
    titulo: "Diagnóstico",
    texto:
      "Como a tomografia e o planejamento digital mostram o que é possível no seu caso.",
  },
  {
    titulo: "Como é a cirurgia",
    texto:
      "Como é o procedimento por dentro e o que fazemos pelo seu conforto, com acompanhamento de perto.",
  },
  {
    titulo: "Dente fixo e cuidado",
    texto:
      "O que acontece depois, e por que o acompanhamento de 24 meses faz diferença.",
  },
];

export function SecaoPassos() {
  return (
    <Section fundo="suave">
      <Container className="grid grid-cols-[minmax(0,1fr)] gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
        <Heading nivel={2}>O que você vai aprender na aula</Heading>
        <div>
          <ol className="flex flex-col">
            {passos.map((passo, indice) => (
              <li
                key={passo.titulo}
                className="relative flex gap-5 pb-10 last:pb-0"
              >
                {indice < passos.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute top-14 bottom-0 left-[1.6875rem] w-0.5 bg-edge"
                  />
                )}
                <span
                  aria-hidden="true"
                  className="flex size-14 shrink-0 items-center justify-center rounded-full bg-field font-display text-title leading-none font-semibold text-on-field"
                >
                  {indice + 1}
                </span>
                <div className="flex min-w-0 flex-col gap-2 pt-2.5">
                  <Heading nivel={3}>
                    <span className="sr-only">Passo {indice + 1}, </span>
                    {passo.titulo}
                  </Heading>
                  <Text>{passo.texto}</Text>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-10">
            <Button href="#inscricao">Quero aprender os 3 passos</Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
