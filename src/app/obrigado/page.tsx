import type { Metadata } from "next";
import { Suspense } from "react";
import { ConteudoGrupo } from "@/components/obrigado/ConteudoGrupo";
import { EventoLead } from "@/components/obrigado/EventoLead";
import { TituloObrigado } from "@/components/obrigado/TituloObrigado";

export const metadata: Metadata = {
  title: "Falta só 1 passo",
  robots: { index: false, follow: false },
};

const PROGRESSO = 90;

export default function ObrigadoPage() {
  return (
    <>
      <Suspense>
        <EventoLead />
      </Suspense>

      <ConteudoGrupo
        topo={
          <>
            <TituloObrigado />
            <div
              role="progressbar"
              aria-label="Sua inscrição"
              aria-valuenow={PROGRESSO}
              aria-valuemin={0}
              aria-valuemax={100}
              className="h-4 overflow-hidden rounded-full bg-paper-3"
            >
              <div
                className="h-full rounded-full bg-action"
                style={{ width: `${PROGRESSO}%` }}
              />
            </div>
          </>
        }
      />
    </>
  );
}
