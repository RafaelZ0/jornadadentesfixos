"use client";

import { useSyncExternalStore } from "react";
import { faseDoReplay, vagasEncerradas } from "@/lib/replay";

function assinar(aoMudar: () => void) {
  const relogio = setInterval(aoMudar, 1000);
  return () => clearInterval(relogio);
}

/** Começa na fase que o servidor viu e muda sozinha se o prazo passar com a página aberta. */
export function useFaseReplay(agoraServidor: number) {
  return useSyncExternalStore(
    assinar,
    () => faseDoReplay(Date.now()),
    () => faseDoReplay(agoraServidor),
  );
}

/** Só o prazo da vaga, sem depender do replay. */
export function useVagasEncerradas(agoraServidor: number) {
  return useSyncExternalStore(
    assinar,
    () => vagasEncerradas(Date.now()),
    () => vagasEncerradas(agoraServidor),
  );
}
