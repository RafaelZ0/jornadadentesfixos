import { BarraFixaInscricao } from "@/components/BarraFixaInscricao";
import { Hero } from "@/components/Hero";
import { EventoInteresse } from "@/components/rastreamento/EventoInteresse";
import { SecaoCasos } from "@/components/secoes/SecaoCasos";
import { SecaoComoVaiSer } from "@/components/secoes/SecaoComoVaiSer";
import { SecaoInscricao } from "@/components/secoes/SecaoInscricao";
import { SecaoMedos } from "@/components/secoes/SecaoMedos";
import { SecaoPassos } from "@/components/secoes/SecaoPassos";
import { SecaoProgramacao } from "@/components/secoes/SecaoProgramacao";
import { SecaoPerguntas } from "@/components/secoes/SecaoPerguntas";
import { SecaoProfessor } from "@/components/secoes/SecaoProfessor";
import { SecaoReconhece } from "@/components/secoes/SecaoReconhece";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { dataDaAula, diaDaAula, horaDaAula } from "@/lib/datas";

export default function Home() {
  return (
    <>
      <EventoInteresse />
      <Hero />

      <SecaoProgramacao />

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
