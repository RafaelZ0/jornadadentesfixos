"use client";

import { useSyncExternalStore } from "react";
import { evento } from "@/config/evento";

const MINUTO = 60_000;
const inicio = new Date(evento.aula.inicio).getTime();
const fim = inicio + evento.aula.duracaoMinutos * MINUTO;

function assinar(aoMudar: () => void) {
  const relogio = setInterval(aoMudar, 1000);
  return () => clearInterval(relogio);
}

const minutoAtual = () => Math.floor(Date.now() / MINUTO) * MINUTO;

export function Contador() {
  // No servidor o valor é null: o contador só aparece no cliente, sem erro de hidratação.
  const agora = useSyncExternalStore(assinar, minutoAtual, () => null);

  const altura = "min-h-36";

  if (agora === null) return <div className={altura} aria-hidden="true" />;

  if (agora >= inicio) {
    return (
      <p
        className={`flex items-center font-display text-title leading-[1.25] font-semibold text-ink ${altura}`}
      >
        {agora < fim ? "A aula está acontecendo agora" : "A aula já aconteceu"}
      </p>
    );
  }

  const restante = Math.floor((inicio - agora) / MINUTO);
  const partes = [
    { valor: Math.floor(restante / 1440), um: "dia", varios: "dias" },
    { valor: Math.floor((restante % 1440) / 60), um: "hora", varios: "horas" },
    { valor: restante % 60, um: "minuto", varios: "minutos" },
  ];
  const leitura = partes
    .map((p) => `${p.valor} ${p.valor === 1 ? p.um : p.varios}`)
    .join(", ");

  return (
    <div className={`flex flex-col gap-3 ${altura}`}>
      <p className="text-md leading-[1.4] font-bold text-ink">
        A aula começa em
      </p>
      <div
        role="timer"
        aria-label={`A aula começa em ${leitura}`}
        className="grid grid-cols-[repeat(3,minmax(0,1fr))] gap-2 sm:gap-3"
      >
        {partes.map((parte) => (
          <p
            key={parte.varios}
            aria-hidden="true"
            className="flex flex-col items-center rounded-control bg-paper-3 px-1 py-3"
          >
            <span className="font-display text-section leading-[1.1] font-semibold text-ink tabular-nums">
              {String(parte.valor).padStart(2, "0")}
            </span>
            <span className="text-sm leading-[1.4] text-ink">
              {parte.valor === 1 ? parte.um : parte.varios}
            </span>
          </p>
        ))}
      </div>
    </div>
  );
}
