import { Foto } from "@/components/Foto";
import { VideoYoutube } from "@/components/VideoYoutube";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { depoimentos } from "@/config/depoimentos";

export function SecaoCasos() {
  if (depoimentos.length === 0) return null;

  return (
    <Section fundo="suave">
      <Container>
        <Heading nivel={2}>Casos reais</Heading>
        <ul className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-8 md:grid-cols-[repeat(2,minmax(0,1fr))] md:gap-(--gap-columns)">
          {depoimentos.map((caso) => (
            <li key={caso.nome} className="flex flex-col gap-4">
              {caso.videoId ? (
                <VideoYoutube
                  id={caso.videoId}
                  formato="16:9"
                  titulo={`Depoimento de ${caso.nome}`}
                />
              ) : (
                caso.foto && (
                  <Foto
                    src={caso.foto}
                    alt={caso.nome}
                    sizes="(min-width: 768px) 540px, calc(100vw - 40px)"
                    reserva={`Foto de ${caso.nome}`}
                    className="aspect-[4/3]"
                  />
                )
              )}
              <Text tipo="abertura">“{caso.frase}”</Text>
              <Text tipo="apoio">
                {caso.nome}, {caso.cidade}
              </Text>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
