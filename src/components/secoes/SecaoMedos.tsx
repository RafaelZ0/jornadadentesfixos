import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";

const medos: { titulo: string; texto: string; icone: ReactNode }[] = [
  {
    titulo: "Tem medo de dor?",
    texto:
      "Você vai ver como é o tratamento por dentro, passo a passo, e o que é feito para o seu conforto.",
    icone: (
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    ),
  },
  {
    titulo: "Acha que tem pouco osso ou idade demais?",
    texto:
      "Vai entender o que realmente define se dá para fazer o implante. E não é só a idade.",
    icone: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <path d="M12 17h.01" />
      </>
    ),
  },
  {
    titulo: "Mora em outra cidade?",
    texto:
      "A clínica fica em Cachoeiro de Itapemirim e recebe pacientes de toda a região Sul do Espírito Santo.",
    icone: (
      <>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
  },
];

export function SecaoMedos() {
  return (
    <Section fundo="suave">
      <Container>
        <ul className="grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-[repeat(3,minmax(0,1fr))] md:gap-(--gap-columns)">
          {medos.map((medo) => (
            <li
              key={medo.titulo}
              className="flex flex-col gap-3 rounded-card bg-surface p-6 shadow-card md:p-8"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="size-11 fill-none stroke-accent stroke-[1.75] [stroke-linecap:round] [stroke-linejoin:round]"
              >
                {medo.icone}
              </svg>
              <Heading nivel={3}>{medo.titulo}</Heading>
              <Text>{medo.texto}</Text>
            </li>
          ))}
        </ul>
        <div className="mt-10 text-center">
          <Button href="#inscricao">Quero tirar minhas dúvidas</Button>
        </div>
      </Container>
    </Section>
  );
}
