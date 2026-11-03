import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const ESPERA_MS = 3000;
const INTERACOES = ["pointerdown", "scroll", "keydown"];
// Páginas de conversão: o script carrega na hora para não perder o evento.
const SEM_ESPERA = ["/obrigado", "/vaga"];

/** Segura um script de terceiros por 3 s ou até o primeiro toque, sem pesar no carregamento. */
export function useLiberarScript(liberado: boolean) {
  const rota = usePathname();
  const [espera, setEspera] = useState(true);

  useEffect(() => {
    if (!liberado || !espera) return;

    const encerrar = () => setEspera(false);
    const relogio = setTimeout(encerrar, ESPERA_MS);
    INTERACOES.forEach((nome) =>
      window.addEventListener(nome, encerrar, { once: true, passive: true }),
    );

    return () => {
      clearTimeout(relogio);
      INTERACOES.forEach((nome) => window.removeEventListener(nome, encerrar));
    };
  }, [liberado, espera]);

  return liberado && (!espera || SEM_ESPERA.includes(rota));
}
