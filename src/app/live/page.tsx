import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { PaginaRedirecionamento } from "@/components/PaginaRedirecionamento";
import { linkDaLive } from "@/lib/lives";
import { horaDaVisita } from "@/lib/replay";

export const metadata: Metadata = {
  title: "Abrindo a live",
  robots: { index: false, follow: false },
};

async function Live() {
  // Decidido a cada visita: o mesmo link do grupo leva sempre para a live do dia.
  await connection();

  return (
    <PaginaRedirecionamento
      destino={linkDaLive(horaDaVisita())}
      evento="live_acesso"
      nome="live"
    />
  );
}

export default function LivePage() {
  return (
    <Suspense fallback={<div className="min-h-svh" aria-hidden="true" />}>
      <Live />
    </Suspense>
  );
}
