import type { Metadata } from "next";
import { BlocoLegal, ListaLegal, PaginaLegal } from "@/components/PaginaLegal";
import { Text } from "@/components/ui/Text";
import { evento } from "@/config/evento";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: `Como o ${evento.clinica.nome} cuida dos seus dados.`,
};

export default function PrivacidadePage() {
  const { clinica, legal } = evento;
  const { endereco } = clinica;

  return (
    <PaginaLegal titulo="Política de Privacidade">
      <Text tipo="abertura">
        Aqui você entende quais dados pedimos, por que pedimos e como pode
        cuidar deles.
      </Text>

      <BlocoLegal titulo="Quem cuida dos seus dados">
        <Text>
          O controlador dos dados é o {clinica.nome}, de razão social{" "}
          {clinica.razaoSocial}, CNPJ {clinica.cnpj}, com endereço em{" "}
          {endereco.logradouro}, {endereco.bairro}, {endereco.cidade} -{" "}
          {endereco.uf}, CEP {endereco.cep}.
        </Text>
      </BlocoLegal>

      <BlocoLegal titulo="Quais dados coletamos">
        <ListaLegal
          itens={[
            "Nome, WhatsApp e cidade, que você informa na inscrição.",
            "Dados de navegação, como endereço IP, tipo de aparelho, navegador e a página de onde você veio.",
            "Cookies do Meta, a empresa dona do Facebook e do Instagram.",
          ]}
        />
      </BlocoLegal>

      <BlocoLegal titulo="Para que usamos">
        <ListaLegal
          itens={[
            "Enviar as informações da aula e das lives.",
            "Permitir que a nossa equipe fale com você sobre a avaliação.",
            "Medir o resultado dos nossos anúncios.",
          ]}
        />
      </BlocoLegal>

      <BlocoLegal titulo="Por que podemos usar">
        <Text>
          A base legal é o seu consentimento, dado na caixa de aceite do
          formulário de inscrição. Você pode retirar esse consentimento quando
          quiser.
        </Text>
      </BlocoLegal>

      <BlocoLegal titulo="Com quem compartilhamos">
        <Text>
          Compartilhamos dados apenas com empresas que fazem o site e a
          comunicação funcionarem:
        </Text>
        <ListaLegal
          itens={[
            "Meta: medição de anúncios e grupo do WhatsApp.",
            "Google: planilha de inscritos e vídeos do YouTube.",
            "Vercel: hospedagem do site.",
          ]}
        />
        <Text>
          Essas empresas podem guardar dados fora do Brasil. Não vendemos os
          seus dados.
        </Text>
      </BlocoLegal>

      <BlocoLegal titulo="Por quanto tempo guardamos">
        <Text>
          Guardamos os seus dados por {legal.prazoGuarda}, ou até você pedir a
          exclusão, salvo quando a lei exigir que sejam mantidos.
        </Text>
      </BlocoLegal>

      <BlocoLegal titulo="Quais são os seus direitos">
        <Text>Pela Lei Geral de Proteção de Dados, você pode pedir para:</Text>
        <ListaLegal
          itens={[
            "Confirmar se temos dados seus e ter acesso a eles.",
            "Corrigir dados errados ou desatualizados.",
            "Excluir os seus dados.",
            "Saber com quem compartilhamos.",
            "Retirar o seu consentimento.",
            "Reclamar à Autoridade Nacional de Proteção de Dados.",
          ]}
        />
      </BlocoLegal>

      <BlocoLegal titulo="Como pedir a exclusão">
        <Text>
          Fale com a gente por {legal.canalPrivacidade}. Para sair do grupo da
          Jornada, basta sair pelo próprio WhatsApp.
        </Text>
      </BlocoLegal>
    </PaginaLegal>
  );
}
