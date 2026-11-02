import Image from "next/image";
import { Foto, temArquivo } from "@/components/Foto";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { evento } from "@/config/evento";

const destaques = [
  { valor: "15+", rotulo: "anos com implantes" },
  { valor: "8.000+", rotulo: "casos conduzidos" },
  { valor: "Professor", rotulo: "de especialização em Implantodontia" },
];

export function SecaoProfessor() {
  const { nome, titulo, cro, textoPessoal, equipe } = evento.responsavelTecnico;
  const emDesenvolvimento = process.env.NODE_ENV !== "production";
  const fotosDaEquipe = equipe.filter((pessoa) => temArquivo(pessoa.foto));

  return (
    <Section>
      <Container className="grid grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-x-16">
        <Heading nivel={2} className="md:col-start-2">
          Quem vai te ensinar
        </Heading>

        <Foto
          src="/images/dr-pablo-sobre.jpg"
          alt={nome}
          sizes="(min-width: 768px) 440px, calc(100vw - 40px)"
          reserva={`Foto do ${nome}`}
          className="aspect-[4/5] md:col-start-1 md:row-span-2 md:row-start-1"
        />

        <div className="flex flex-col gap-6 md:col-start-2">
          <div>
            <Heading nivel={3}>{nome}</Heading>
            <Text className="mt-1 text-ink-2">{titulo}</Text>
            <Text className="text-ink-2">{cro}</Text>
          </div>

          <dl className="flex flex-col">
            {destaques.map((destaque) => (
              <div
                key={destaque.valor}
                className="flex flex-col border-t border-rule py-4 last:pb-0"
              >
                <dd className="order-first font-display text-section leading-[1.15] font-semibold text-ink">
                  {destaque.valor}
                </dd>
                <dt className="text-md leading-[1.4] text-ink-2">
                  {destaque.rotulo}
                </dt>
              </div>
            ))}
          </dl>

          {textoPessoal ? (
            <Text>{textoPessoal}</Text>
          ) : (
            emDesenvolvimento && (
              <Text className="rounded-control border-2 border-dashed border-error p-3 font-bold text-error">
                Texto do Dr. Pablo: por que se dedicou ao implante
              </Text>
            )
          )}

          <div className="flex flex-wrap items-center gap-3">
            {fotosDaEquipe.map((pessoa) => (
              <Image
                key={pessoa.nome}
                src={pessoa.foto}
                alt={pessoa.nome}
                width={56}
                height={56}
                className="size-14 rounded-full object-cover"
              />
            ))}
            <Text>
              Ao lado da equipe: {equipe.map((p) => p.nome).join(" e ")}
            </Text>
          </div>

          <div>
            <Button href="#inscricao-final">Quero aprender com ele</Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
