import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { temArquivo } from "@/components/Foto";
import { ConteudoReplay } from "@/components/replay/ConteudoReplay";
import { evento } from "@/config/evento";
import { videoReplayId } from "@/config/replay-servidor";
import { faseDoReplay, horaDaVisita } from "@/lib/replay";

export const metadata: Metadata = {
  title: "Replay da aula",
  robots: { index: false, follow: false },
};

async function Replay() {
  // A fase é decidida a cada visita: depois do prazo, o vídeo nem chega ao navegador.
  await connection();
  const agora = horaDaVisita();
  const { capa } = evento.replay;

  return (
    <ConteudoReplay
      agoraServidor={agora}
      videoId={faseDoReplay(agora) === "no-ar" ? videoReplayId : ""}
      capaLocal={temArquivo(capa) ? capa : undefined}
    />
  );
}

export default function ReplayPage() {
  return (
    <Suspense fallback={<div className="min-h-svh" aria-hidden="true" />}>
      <Replay />
    </Suspense>
  );
}
