import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { evento } from "@/config/evento";

export const metadata: Metadata = {
  title: "Guia de estilo",
  robots: { index: false, follow: false },
};

const inicio = new Date(evento.aula.inicio);
const fuso = { timeZone: evento.fusoHorario };

const diaEMes = new Intl.DateTimeFormat("pt-BR", {
  ...fuso,
  day: "numeric",
  month: "long",
}).format(inicio);

const diaDaSemana = new Intl.DateTimeFormat("pt-BR", {
  ...fuso,
  weekday: "long",
}).format(inicio);

const hora = new Intl.DateTimeFormat("pt-BR", {
  ...fuso,
  hour: "2-digit",
  minute: "2-digit",
})
  .format(inicio)
  .replace(":", "h");

const cores = [
  { nome: "Fundo creme", hex: "#FBF7F0", uso: "Fundo das páginas", classe: "bg-paper border border-edge" },
  { nome: "Superfície", hex: "#FFFFFF", uso: "Cartões e campos", classe: "bg-surface border border-edge" },
  { nome: "Texto", hex: "#1C1A17", uso: "16,3:1 no creme", classe: "bg-ink" },
  { nome: "Texto secundário", hex: "#4A443C", uso: "9,0:1 no creme", classe: "bg-ink-2" },
  { nome: "Botão", hex: "#0F7A3E", uso: "5,4:1 com texto branco", classe: "bg-action" },
  { nome: "Botão ativo", hex: "#0B5F30", uso: "7,8:1 com texto branco", classe: "bg-action-hover" },
  { nome: "Faixa verde", hex: "#23413A", uso: "10,4:1 com creme", classe: "bg-field" },
  { nome: "Terracota", hex: "#8F3F1E", uso: "Só em detalhes, 6,8:1", classe: "bg-accent" },
  { nome: "Borda de campo", hex: "#7A6F60", uso: "4,6:1 no creme", classe: "bg-edge" },
  { nome: "Erro", hex: "#B3261E", uso: "6,1:1 no creme", classe: "bg-error" },
];

function Rotulo({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-sm leading-[1.5] text-ink-2">{children}</p>;
}

export default function EstiloPage() {
  return (
    <>
      <Section className="pt-12 md:pt-20">
        <Container className="grid gap-10 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:items-end md:gap-16">
          <div>
            <Text tipo="apoio" className="mb-4">
              Aula gratuita, ao vivo no {evento.aula.plataforma}
            </Text>
            <Heading nivel={1} tamanho="convite">
              {diaEMes}
            </Heading>
            <Text tipo="abertura" className="mt-3 font-display font-semibold">
              {diaDaSemana}, às {hora}
            </Text>
          </div>
          <div className="flex flex-col gap-6">
            <Text>
              Página temporária para você aprovar cores, letras e botões. Esta
              data, em tamanho grande, é a assinatura visual do convite.
            </Text>
            <Button>Quero participar</Button>
          </div>
        </Container>
      </Section>

      <Section className="border-t border-rule">
        <Container>
          <Heading nivel={2}>Cores</Heading>
          <ul className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-x-(--gap-columns) gap-y-5 sm:grid-cols-[repeat(2,minmax(0,1fr))] lg:grid-cols-[repeat(3,minmax(0,1fr))]">
            {cores.map((cor) => (
              <li key={cor.hex} className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className={`size-16 shrink-0 rounded-control ${cor.classe}`}
                />
                <span className="min-w-0">
                  <span className="block font-bold text-ink">{cor.nome}</span>
                  <span className="block text-sm leading-[1.5] text-ink-2">
                    {cor.hex}
                    <br />
                    {cor.uso}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section className="border-t border-rule">
        <Container largura="texto" className="flex flex-col gap-10">
          <Heading nivel={2}>Letras</Heading>
          <div>
            <Rotulo>Manchete, Literata, de 40 a 64px</Rotulo>
            <p className="font-display text-display leading-[1.12] font-semibold tracking-display text-balance">
              {evento.promessa}
            </p>
          </div>
          <div>
            <Rotulo>Título de seção, de 32 a 44px</Rotulo>
            <p className="font-display text-section leading-[1.18] font-semibold tracking-display text-balance">
              Os 3 passos para trocar a dentadura
            </p>
          </div>
          <div>
            <Rotulo>Título menor, de 25 a 28px</Rotulo>
            <Heading nivel={3}>Veja o que define o seu caso</Heading>
          </div>
          <div>
            <Rotulo>Abertura, de 22 a 24px</Rotulo>
            <Text tipo="abertura">
              Entenda como funciona, com calma, sem sair de casa.
            </Text>
          </div>
          <div>
            <Rotulo>Corpo, Atkinson Hyperlegible, de 19 a 20px</Rotulo>
            <Text>
              Você vai saber o que acontece em cada etapa, do primeiro exame ao
              dente no lugar. A aula é feita para quem usa dentadura e tem
              dúvidas sobre osso, idade e dor.
            </Text>
          </div>
          <div>
            <Rotulo>Apoio, 17px, o menor texto do site</Rotulo>
            <Text tipo="apoio">
              Avisos curtos, ajuda de campo e rodapé. Continua fácil de ler.
            </Text>
          </div>
        </Container>
      </Section>

      <Section className="border-t border-rule">
        <Container>
          <Heading nivel={2}>Botões</Heading>
          <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-x-(--gap-columns) gap-y-8 md:grid-cols-[repeat(3,minmax(0,1fr))]">
            <div>
              <Rotulo>Normal</Rotulo>
              <Button>Quero participar</Button>
            </div>
            <div>
              <Rotulo>Ao passar o mouse</Rotulo>
              <Button demo="hover">Quero participar</Button>
            </div>
            <div>
              <Rotulo>Ao tocar</Rotulo>
              <Button demo="active">Quero participar</Button>
            </div>
            <div>
              <Rotulo>Com foco do teclado</Rotulo>
              <Button demo="focus">Quero participar</Button>
            </div>
            <div>
              <Rotulo>Carregando</Rotulo>
              <Button loading>Quero participar</Button>
            </div>
            <div>
              <Rotulo>Desabilitado</Rotulo>
              <Button disabled>Quero participar</Button>
            </div>
          </div>
        </Container>
      </Section>

      <Section fundo="destaque">
        <Container largura="texto" className="flex flex-col gap-6">
          <Heading nivel={2}>Faixa de destaque</Heading>
          <Text tipo="abertura">
            Dá uma pausa na leitura e marca o momento mais importante da
            página.
          </Text>
          <Text>
            Aqui o botão muda para creme, porque o verde sobre verde ficaria
            difícil de enxergar.
          </Text>
          <div>
            <Button>Quero participar</Button>
          </div>
        </Container>
      </Section>

      <Section>
        <Container largura="texto">
          <div className="rounded-card bg-surface p-6 shadow-card md:p-10">
            <Heading nivel={3}>Cartão</Heading>
            <Text className="mt-3">
              Borda arredondada de 16px e sombra bem discreta, para separar um
              conteúdo do fundo creme sem pesar.
            </Text>
          </div>
        </Container>
      </Section>
    </>
  );
}
