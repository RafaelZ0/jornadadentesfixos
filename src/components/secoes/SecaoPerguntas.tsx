import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { dataFimReplay, horaFimReplay } from "@/lib/datas";

const perguntas = [
  {
    pergunta: "A aula é gratuita mesmo?",
    resposta: "Sim. A aula é gratuita e online.",
  },
  {
    pergunta: "Preciso saber mexer no computador?",
    resposta:
      "Não. Você recebe o link pelo WhatsApp e assiste pelo celular, é só tocar.",
  },
  {
    pergunta: "Vou ter que pagar alguma coisa na aula?",
    resposta:
      "Não. No final, o Dr. Pablo explica como agendar uma avaliação com uma condição especial para quem participou. Agendar é uma escolha sua.",
  },
  {
    pergunta: "Tenho mais de 70 anos. A aula serve para mim?",
    resposta:
      "Serve. Um dos temas é justamente o que define se a pessoa pode fazer implante.",
  },
  {
    pergunta: "E se eu não puder assistir ao vivo?",
    resposta: `O replay fica no ar até ${dataFimReplay} às ${horaFimReplay}.`,
  },
  {
    pergunta: "Posso convidar alguém da família?",
    resposta: "Pode e deve. Cada pessoa faz a sua inscrição.",
  },
];

export function SecaoPerguntas() {
  return (
    <Section fundo="suave">
      <Container largura="texto">
        <Heading nivel={2}>Perguntas frequentes</Heading>
        <div className="mt-8 flex flex-col gap-3">
          {perguntas.map((item) => (
            <details
              key={item.pergunta}
              className="group rounded-control bg-surface shadow-card"
            >
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 rounded-control px-5 py-3 text-md leading-[1.35] font-bold text-ink hover:text-accent [&::-webkit-details-marker]:hidden">
                {item.pergunta}
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="size-7 shrink-0 fill-none stroke-current stroke-[2.5] transition-transform duration-(--dur-short) ease-out group-open:rotate-180"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </summary>
              <Text className="px-5 pb-5">{item.resposta}</Text>
            </details>
          ))}
        </div>
        <div className="mt-10">
          <Button href="#inscricao-final">Quero participar</Button>
        </div>
      </Container>
    </Section>
  );
}
