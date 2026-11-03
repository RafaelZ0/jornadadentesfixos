import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { ConteudoVaga } from "@/components/vaga/ConteudoVaga";
import { horaDaVisita } from "@/lib/replay";

export const metadata: Metadata = {
  title: "Sua vaga de avaliação",
  robots: { index: false, follow: false },
};

async function Vaga() {
  // Mesmo prazo do replay: depois de 30/11 às 22h, a condição sai da página.
  await connection();
  return <ConteudoVaga agoraServidor={horaDaVisita()} />;
}

export default function VagaPage() {
  return (
    <Suspense fallback={<div className="min-h-svh" aria-hidden="true" />}>
      <Vaga />
    </Suspense>
  );
}
