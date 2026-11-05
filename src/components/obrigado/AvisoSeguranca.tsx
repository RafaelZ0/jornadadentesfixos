import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { evento } from "@/config/evento";

// Público 55+ é alvo comum de golpe no WhatsApp. A equipe liga e chama no privado, mas nunca pede dinheiro.
export function AvisoSeguranca() {
  const { clinicaExibicao } = evento.whatsapp;

  return (
    <div className="flex flex-col gap-3 rounded-card border-2 border-ink p-5 md:p-6">
      <Heading nivel={2} tamanho="titulo">
        Para sua segurança
      </Heading>
      <Text>
        O grupo é só de avisos. Só a equipe da Jornada envia mensagens, com os
        links das lives e da aula.
      </Text>
      <Text>
        <strong className="font-bold">
          Nunca pedimos dinheiro, senha ou código pelo WhatsApp.
        </strong>{" "}
        Se alguém pedir isso em nome da clínica, não responda e avise a gente no{" "}
        <span className="font-bold whitespace-nowrap">{clinicaExibicao}</span>.
      </Text>
    </div>
  );
}
