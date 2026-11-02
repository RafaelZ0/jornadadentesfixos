import type { Metadata } from "next";
import { BlocoLegal, ListaLegal, PaginaLegal } from "@/components/PaginaLegal";
import { Text } from "@/components/ui/Text";
import { evento } from "@/config/evento";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: `Regras de participação em ${evento.nomeCurto}.`,
};

export default function TermosPage() {
  const { clinica, nome } = evento;

  return (
    <PaginaLegal titulo="Termos de Uso">
      <Text tipo="abertura">
        Estas são as regras para participar de {nome}, organizada pelo{" "}
        {clinica.nome}.
      </Text>

      <BlocoLegal titulo="A aula é gratuita e educativa">
        <Text>
          A aula é gratuita, online e tem caráter educativo. O objetivo é
          explicar, em linguagem simples, como funciona o tratamento com
          implantes.
        </Text>
      </BlocoLegal>

      <BlocoLegal titulo="A aula não substitui uma consulta">
        <Text>
          As informações da aula são gerais. Cada caso é diferente, e nada do
          que é dito substitui a consulta com um profissional.
        </Text>
      </BlocoLegal>

      <BlocoLegal titulo="Não há promessa de resultado">
        <Text>
          Nem a aula nem este site prometem resultado. O resultado de qualquer
          tratamento depende de cada pessoa.
        </Text>
      </BlocoLegal>

      <BlocoLegal titulo="A indicação de tratamento">
        <Text>
          A indicação de tratamento só acontece em avaliação presencial, feita
          por um profissional da clínica. Agendar a avaliação é uma escolha
          sua.
        </Text>
      </BlocoLegal>

      <BlocoLegal titulo="Regras do grupo de WhatsApp">
        <Text>O grupo existe para enviar as informações da Jornada.</Text>
        <ListaLegal
          itens={[
            "Trate todas as pessoas com respeito.",
            "Não envie propaganda, correntes nem links de terceiros.",
            "Não compartilhe dados ou fotos de outras pessoas.",
            "Dúvidas sobre o seu caso devem ser tratadas com a equipe da clínica, não no grupo.",
          ]}
        />
        <Text>
          Quem descumprir essas regras pode ser removido. Você pode sair do
          grupo quando quiser.
        </Text>
      </BlocoLegal>

      <BlocoLegal titulo="Propriedade do conteúdo">
        <Text>
          A aula, os vídeos, os textos e as imagens pertencem ao {clinica.nome}{" "}
          e aos seus autores. Você pode assistir e indicar a aula, mas não pode
          copiar, gravar para distribuir ou vender esse conteúdo sem
          autorização por escrito.
        </Text>
      </BlocoLegal>

      <BlocoLegal titulo="Seus dados">
        <Text>
          O uso dos seus dados está explicado na{" "}
          <a
            href={evento.rotas.privacidade}
            className="text-accent underline underline-offset-4"
          >
            Política de Privacidade
          </a>
          .
        </Text>
      </BlocoLegal>
    </PaginaLegal>
  );
}
