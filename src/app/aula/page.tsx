import type { Metadata } from "next";
import { PaginaRedirecionamento } from "@/components/PaginaRedirecionamento";
import { evento } from "@/config/evento";

export const metadata: Metadata = {
  title: "Abrindo a aula",
  robots: { index: false, follow: false },
};

export default function AulaPage() {
  return (
    <PaginaRedirecionamento
      destino={evento.youtube.aulaUrl}
      evento="aula_acesso"
      nome="aula"
    />
  );
}
