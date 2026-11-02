import { BarraFixaInscricao } from "@/components/BarraFixaInscricao";
import { Hero } from "@/components/Hero";
import { LeadForm } from "@/components/LeadForm";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { evento } from "@/config/evento";
import { dataDaAula, diaDaAula, horaDaAula } from "@/lib/datas";

export default function Home() {
  return (
    <>
      <Hero />

      <Section id="inscricao" fundo="destaque">
        <Container className="grid grid-cols-[minmax(0,1fr)] gap-8 md:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] md:items-center md:gap-16">
          <div>
            <Heading nivel={2} tamanho="convite">
              {dataDaAula}
            </Heading>
            <Text
              tipo="abertura"
              className="mt-3 font-display font-semibold"
            >
              {diaDaAula}, às {horaDaAula}
            </Text>
            <Text className="mt-4">
              Ao vivo no {evento.aula.plataforma}, por cerca de{" "}
              {evento.aula.duracaoMinutos} minutos.
            </Text>
          </div>

          <div className="surface-card rounded-card bg-surface p-5 md:p-8">
            <LeadForm />
          </div>
        </Container>
      </Section>

      <BarraFixaInscricao />
    </>
  );
}
