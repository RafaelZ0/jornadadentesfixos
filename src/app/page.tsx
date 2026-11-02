import { BarraFixaInscricao } from "@/components/BarraFixaInscricao";
import { Hero } from "@/components/Hero";
import { EventoInteresse } from "@/components/rastreamento/EventoInteresse";
import { SecaoCasos } from "@/components/secoes/SecaoCasos";
import { SecaoComoVaiSer } from "@/components/secoes/SecaoComoVaiSer";
import { SecaoInscricao } from "@/components/secoes/SecaoInscricao";
import { SecaoMedos } from "@/components/secoes/SecaoMedos";
import { SecaoPassos } from "@/components/secoes/SecaoPassos";
import { SecaoPerguntas } from "@/components/secoes/SecaoPerguntas";
import { SecaoProfessor } from "@/components/secoes/SecaoProfessor";
import { SecaoReconhece } from "@/components/secoes/SecaoReconhece";
import { SecaoVideo } from "@/components/secoes/SecaoVideo";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { evento } from "@/config/evento";
import { dataDaAula, diaDaAula, horaDaAula } from "@/lib/datas";

export default function Home() {
  return (
    <>
      <EventoInteresse />
      <Hero />

      <SecaoInscricao id="inscricao">
        <Heading nivel={2} tamanho="convite">
          {dataDaAula}
        </Heading>
        <Text tipo="abertura" className="mt-3 font-display font-semibold">
          {diaDaAula}, às {horaDaAula}
        </Text>
        <Text className="mt-4">
          Ao vivo no {evento.aula.plataforma}, por cerca de{" "}
          {evento.aula.duracaoMinutos} minutos.
        </Text>
      </SecaoInscricao>

      <SecaoVideo />
      <SecaoMedos />
      <SecaoReconhece />
      <SecaoPassos />
      <SecaoProfessor />
      <SecaoCasos />
      <SecaoComoVaiSer />
      <SecaoPerguntas />

      <SecaoInscricao id="inscricao-final">
        <Heading nivel={2}>Seu novo sorriso começa com informação</Heading>
        <Text tipo="abertura" className="mt-4 font-display font-semibold">
          {diaDaAula}, {dataDaAula}, às {horaDaAula}
        </Text>
      </SecaoInscricao>

      <BarraFixaInscricao />
    </>
  );
}
