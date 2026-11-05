import type { Metadata } from "next";
import { ConteudoGrupo } from "@/components/obrigado/ConteudoGrupo";
import { Heading } from "@/components/ui/Heading";

// Para o remarketing de quem se inscreveu e não entrou no grupo. Não conta como inscrição na Meta.
export const metadata: Metadata = {
  title: "Grupo de WhatsApp da Jornada",
  robots: { index: false, follow: false },
};

export default function GrupoPage() {
  return (
    <ConteudoGrupo
      topo={
        <Heading nivel={1} tamanho="hero">
          Grupo de WhatsApp da Jornada
        </Heading>
      }
    />
  );
}
