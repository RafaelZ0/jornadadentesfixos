"use client";

import { useEffect, useRef } from "react";
import { enviarEvento, type EventoGtm } from "@/lib/rastreamento";

// Tempo mínimo na página: o Pixel precisa carregar e enviar o PageView antes de sair.
const ESPERA_MINIMA_MS = 1500;
// Tempo máximo, mesmo que o GTM não responda.
const ESPERA_MAXIMA_MS = 3000;

/** Conta o acesso no GTM e leva para o YouTube. Assim dá para medir o comparecimento. */
export function Redirecionamento({
  destino,
  evento,
}: {
  destino: string;
  evento: EventoGtm;
}) {
  const enviado = useRef(false);

  useEffect(() => {
    let gtmRespondeu = false;
    let tempoMinimoPassou = false;
    let foi = false;

    const seguir = () => {
      if (foi) return;
      foi = true;
      window.location.replace(destino);
    };
    const talvezSeguir = () => {
      if (gtmRespondeu && tempoMinimoPassou) seguir();
    };

    const minimo = setTimeout(() => {
      tempoMinimoPassou = true;
      talvezSeguir();
    }, ESPERA_MINIMA_MS);
    const maximo = setTimeout(seguir, ESPERA_MAXIMA_MS);

    // Uma vez só, mesmo quando o React roda o efeito duas vezes em desenvolvimento.
    if (!enviado.current) {
      enviado.current = true;
      enviarEvento(evento, {
        eventCallback: () => {
          gtmRespondeu = true;
          talvezSeguir();
        },
        eventTimeout: ESPERA_MAXIMA_MS,
      });
    } else {
      gtmRespondeu = true;
    }

    return () => {
      clearTimeout(minimo);
      clearTimeout(maximo);
    };
  }, [destino, evento]);

  return null;
}
