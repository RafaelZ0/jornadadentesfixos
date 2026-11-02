import { Contador } from "@/components/Contador";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { evento } from "@/config/evento";
import {
  dataDaAula,
  dataFimReplay,
  diaDaAula,
  diaFimReplay,
  duracaoPorExtenso,
  horaDaAula,
  horaFimReplay,
} from "@/lib/datas";

const itens = [
  { rotulo: "Quando", texto: `${diaDaAula}, ${dataDaAula}, às ${horaDaAula}` },
  {
    rotulo: "Onde",
    texto: `Ao vivo no ${evento.aula.plataforma}. O link chega no seu WhatsApp. Não precisa instalar nada nem criar conta.`,
  },
  { rotulo: "Duração", texto: `Cerca de ${duracaoPorExtenso}` },
  {
    rotulo: "Perdeu?",
    texto: `O replay fica disponível até ${diaFimReplay}, ${dataFimReplay}, às ${horaFimReplay}.`,
  },
];

export function SecaoComoVaiSer() {
  return (
    <Section>
      <Container largura="texto">
        <div className="section-field flex flex-col gap-6 rounded-card bg-field p-6 text-on-field md:p-10">
          <Heading nivel={2}>Como vai ser a aula</Heading>
          <Contador />
          <dl className="flex flex-col">
            {itens.map((item) => (
              <div key={item.rotulo} className="border-t border-rule py-3">
                <dt className="text-md leading-[1.4] font-bold text-ink">
                  {item.rotulo}
                </dt>
                <dd
                  className={`text-md leading-[1.5] text-ink ${item.rotulo === "Quando" ? "font-display font-semibold" : ""}`}
                >
                  {item.texto}
                </dd>
              </div>
            ))}
          </dl>
          <div>
            <Button href="#inscricao-final">Fazer minha inscrição</Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
