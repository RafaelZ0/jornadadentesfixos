"use client";

import { useSyncExternalStore } from "react";
import { avisoDoTopo } from "@/lib/barra-topo";

const MINUTO = 60_000;

function assinar(aoMudar: () => void) {
  const relogio = setInterval(aoMudar, 30_000);
  return () => clearInterval(relogio);
}

const minutoAtual = () => Math.floor(Date.now() / MINUTO) * MINUTO;

/**
 * Mostra a próxima data da programação. Começa com o horário da visita, visto pelo servidor,
 * e segue o relógio do navegador se a data mudar com a página aberta.
 */
export function BarraTopo({ agoraServidor }: { agoraServidor: number }) {
  const agora = useSyncExternalStore(
    assinar,
    minutoAtual,
    () => agoraServidor,
  );
  const { principal, complemento, link } = avisoDoTopo(agora);

  const conteudo = (
    <>
      <span className="inline-block">{principal}</span>
      {complemento && (
        <>
          <span className="hidden sm:inline" aria-hidden="true">
            {" · "}
          </span>{" "}
          <span className="inline-block">{complemento}</span>
        </>
      )}
    </>
  );

  return (
    <p className="section-field bg-field px-(--gutter) py-2 text-center text-xs leading-[1.35] font-bold text-balance text-on-field uppercase">
      {link ? (
        <a
          href={link}
          className="text-on-field underline underline-offset-4 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          {conteudo}
        </a>
      ) : (
        conteudo
      )}
    </p>
  );
}
