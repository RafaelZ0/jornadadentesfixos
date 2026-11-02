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

  const altura = "flex min-h-24 items-center";

  if (agora === null) return <div className={altura} aria-hidden="true" />;

  if (agora >= inicio) {
    return (
      <p
        className={`${altura} font-display text-title leading-[1.25] font-semibold text-ink`}
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

  return (
    <div role="timer" aria-label="Tempo até a aula" className={`${altura} gap-6`}>
      {partes.map((parte) => (
        <p key={parte.varios} className="flex min-w-16 flex-col">
          <span className="font-display text-section leading-[1.1] font-semibold text-ink tabular-nums">
            {parte.valor}
          </span>
          <span className="text-sm leading-[1.4] text-ink-2">
            {parte.valor === 1 ? parte.um : parte.varios}
          </span>
        </p>
      ))}
    </div>
  );
}
