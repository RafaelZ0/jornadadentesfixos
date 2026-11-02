import { useSyncExternalStore } from "react";

const CHAVE = "jornada_cookies";
const ouvintes = new Set<() => void>();
let aceitoNaMemoria = false;

export function aceitouCookies() {
  try {
    return localStorage.getItem(CHAVE) === "aceito" || aceitoNaMemoria;
  } catch {
    return aceitoNaMemoria;
  }
}

export function aceitarCookies() {
  aceitoNaMemoria = true;
  try {
    localStorage.setItem(CHAVE, "aceito");
  } catch {
    // Sem armazenamento: o aceite vale só até fechar a página.
  }
  ouvintes.forEach((avisar) => avisar());
}

function assinar(aoMudar: () => void) {
  ouvintes.add(aoMudar);
  return () => {
    ouvintes.delete(aoMudar);
  };
}

export function useAceitouCookies() {
  return useSyncExternalStore(assinar, aceitouCookies, () => false);
}
