import type { Metadata } from "next";
import { temArquivo } from "@/components/Foto";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { evento } from "@/config/evento";
import { videoReplayId } from "@/config/replay-servidor";

// Página interna da equipe: não aparece no Google e nenhuma página do site leva até aqui.
export const metadata: Metadata = {
  title: "Testes",
  robots: { index: false, follow: false },
};

type Pagina = {
  caminho: string;
  nome: string;
  confira: string;
  /** O que precisa estar cadastrado para a página funcionar por completo. */
  depende?: { rotulo: string; pronto: boolean };
  /** Redirecionamentos e arquivos abrem em outra aba. */
  novaAba?: boolean;
};

const linkDeTeste = `/?utm_source=teste&utm_medium=teste&utm_campaign=${encodeURIComponent("jornada-dentes-fixos")}`;

const grupos: { titulo: string; paginas: Pagina[] }[] = [
  {
    titulo: "Inscrição na aula",
    paginas: [
      {
        caminho: "/",
        nome: "Página de inscrição",
        confira:
          "Barra do topo, formulário e barra verde ao rolar. Inscreva-se com o seu número e confira a aba Inscritos.",
      },
      {
        caminho: linkDeTeste,
        nome: "Inscrição com origem de teste",
        confira: "Depois de se inscrever por aqui, a coluna Origem da planilha mostra “teste”.",
      },
      {
        caminho: "/obrigado",
        nome: "Obrigado",
        confira:
          "Botão verde do grupo. Aberta por aqui, não conta como inscrição na Meta.",
        depende: { rotulo: "Link do grupo", pronto: Boolean(evento.whatsapp.grupoUrl) },
      },
      {
        caminho: evento.rotas.grupo,
        nome: "Grupo do WhatsApp",
        confira:
          "Mesmo conteúdo do obrigado, para anúncios de quem se inscreveu e não entrou no grupo. Não conta como inscrição.",
        depende: { rotulo: "Link do grupo", pronto: Boolean(evento.whatsapp.grupoUrl) },
      },
    ],
  },
  {
    titulo: "Lives e aula (links curtos para o grupo)",
    paginas: [
      {
        caminho: "/live",
        nome: "Próxima live",
        confira: "Mostra “Abrindo a live” e vai para o YouTube. Sem link cadastrado, avisa que o link ainda não foi liberado.",
        depende: { rotulo: "Link da próxima live", pronto: Boolean(evento.youtube.proximaLiveUrl) },
        novaAba: true,
      },
      {
        caminho: "/aula",
        nome: "Aula ao vivo",
        confira: "Mostra “Abrindo a aula” e vai para o YouTube. Cada acesso conta no GTM (aula_acesso). Sem link cadastrado, avisa que o link ainda não foi liberado.",
        depende: { rotulo: "Link da aula", pronto: Boolean(evento.youtube.aulaUrl) },
        novaAba: true,
      },
    ],
  },
  {
    titulo: "Depois da aula",
    paginas: [
      {
        caminho: "/replay",
        nome: "Replay",
        confira: "Contador até 26/11 às 22h, vídeo, botão da vaga e os 3 bônus.",
        depende: { rotulo: "ID do replay", pronto: Boolean(videoReplayId) },
      },
      {
        caminho: "/vaga",
        nome: "Vaga de avaliação",
        confira:
          "Um pedido de teste cai no topo da aba Vagas e manda o e-mail de aviso. Apague a linha depois.",
        depende: {
          rotulo: "WhatsApp do comercial",
          pronto: Boolean(evento.vaga.whatsappComercialE164),
        },
      },
      {
        caminho: "/contato.vcf",
        nome: "Salvar o número da clínica",
        confira: "No celular, abre a tela de salvar contato.",
        novaAba: true,
      },
    ],
  },
  {
    titulo: "Rodapé",
    paginas: [
      {
        caminho: evento.rotas.termos,
        nome: "Termos de uso",
        confira: "Texto aprovado pelo jurídico, sem aviso de rascunho.",
      },
      {
        caminho: evento.rotas.privacidade,
        nome: "Privacidade",
        confira: "Texto aprovado pelo jurídico, sem aviso de rascunho.",
      },
    ],
  },
];

const fotos = [
  "/images/dr-pablo-hero.jpg",
  "/images/dr-pablo-sobre.jpg",
];

export default function TestesPage() {
  const faltando = fotos.filter((foto) => !temArquivo(foto));

  return (
    <Section className="pt-6 md:pt-14">
      <Container largura="texto" className="flex flex-col gap-12">
        <div className="flex flex-col gap-3">
          <Heading nivel={1}>Páginas para testar</Heading>
          <Text tipo="abertura">
            Toque em cada botão, confira o que está escrito embaixo e volte aqui.
          </Text>
          {faltando.length > 0 && (
            <Text>
              <strong>Arquivos que ainda faltam:</strong> {faltando.join(", ")}
            </Text>
          )}
        </div>

        {grupos.map((grupo) => (
          <section key={grupo.titulo} className="flex flex-col gap-6">
            <Heading nivel={2} tamanho="titulo">
              {grupo.titulo}
            </Heading>
            <ul className="flex flex-col gap-8">
              {grupo.paginas.map((pagina) => (
                <li
                  key={pagina.caminho}
                  className="flex flex-col gap-3 border-t-2 border-paper-3 pt-6"
                >
                  <p className="text-lg leading-[1.35] font-bold text-ink">
                    {pagina.nome}{" "}
                    <span className="font-normal whitespace-nowrap text-ink-2">
                      {pagina.caminho.split("?")[0]}
                    </span>
                  </p>
                  <Text>{pagina.confira}</Text>
                  {pagina.depende && (
                    <p
                      className={`text-md leading-[1.4] font-bold ${pagina.depende.pronto ? "text-action" : "text-error"}`}
                    >
                      {pagina.depende.rotulo}:{" "}
                      {pagina.depende.pronto ? "cadastrado" : "falta cadastrar"}
                    </p>
                  )}
                  <Button href={pagina.caminho} novaAba={pagina.novaAba}>
                    Abrir {pagina.nome.toLowerCase()}
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </Container>
    </Section>
  );
}
