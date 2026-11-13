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
import { evento } from "@/config/evento";
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
        {/* Com o título novo no topo, a promessa vem para o fechamento. Com o antigo, ela já está no topo. */}
        <Heading nivel={2}>
          {evento.primeiraTela.titulo === "aula"
            ? evento.promessa
            : "Seu novo sorriso começa com informação"}
        </Heading>
        <Text tipo="abertura" className="mt-4 font-display font-semibold">
          {diaDaAula}, {dataDaAula}, às {horaDaAula}
        </Text>
      </SecaoInscricao>

      <BarraFixaInscricao />
    </>
  );
}
