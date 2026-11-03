"use client";

import { useSyncExternalStore } from "react";
import { faseDoReplay } from "@/lib/replay";

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
