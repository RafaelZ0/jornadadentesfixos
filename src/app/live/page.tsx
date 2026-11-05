import type { Metadata } from "next";
import { PaginaRedirecionamento } from "@/components/PaginaRedirecionamento";
import { evento } from "@/config/evento";

export const metadata: Metadata = {
  title: "Abrindo a live",
  robots: { index: false, follow: false },
};

export default function LivePage() {
  return (
    <PaginaRedirecionamento
      destino={evento.youtube.proximaLiveUrl}
      evento="live_acesso"
      nome="live"
    />
  );
}
