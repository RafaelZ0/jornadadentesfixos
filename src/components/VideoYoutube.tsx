"use client";

import Image from "next/image";
import { useState } from "react";
import type { FormatoVideo } from "@/config/evento";
import { rastrear } from "@/lib/pixel";
import { proporcoes } from "@/lib/video";

type VideoYoutubeProps = {
  id: string;
  formato: FormatoVideo;
  titulo: string;
  capa?: string;
  /** Usada se a capa principal não carregar (a miniatura maior do YouTube nem sempre existe). */
  capaReserva?: string;
  sizes?: string;
  eventoPixel?: string;
};

export function VideoYoutube({
  id,
  formato,
  titulo,
  capa,
  capaReserva,
  sizes = "(min-width: 768px) 420px, calc(100vw - 40px)",
  eventoPixel,
}: VideoYoutubeProps) {
  const [tocando, setTocando] = useState(false);
  const [capaFalhou, setCapaFalhou] = useState(false);
  const capaAtual = capaFalhou ? capaReserva : capa;

  function aoTocar() {
    if (eventoPixel) rastrear("trackCustom", eventoPixel);
    setTocando(true);
  }

  return (
    <div
      className={`relative mx-auto overflow-hidden rounded-card bg-field ${proporcoes[formato]}`}
    >
      {tocando ? (
        <iframe
          // autoplay só depois do toque, para a pessoa não precisar tocar duas vezes.
          src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&playsinline=1`}
          title={titulo}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 size-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={aoTocar}
          className="group absolute inset-0 flex size-full cursor-pointer flex-col items-center justify-center gap-4 focus-visible:-outline-offset-8 focus-visible:outline-on-field"
        >
          {capaAtual && (
            <Image
              key={capaAtual}
              src={capaAtual}
              alt=""
              fill
              sizes={sizes}
              onError={() => setCapaFalhou(true)}
              className="object-cover"
            />
          )}
          <span className="relative flex size-22 items-center justify-center rounded-full bg-action text-on-action transition-colors duration-(--dur-micro) ease-out group-hover:bg-action-hover">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="ml-1 size-10 fill-current"
            >
              <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z" />
            </svg>
          </span>
          <span className="relative rounded-control bg-paper px-4 py-2 text-md leading-tight font-bold text-ink">
            Toque para assistir
          </span>
        </button>
      )}
    </div>
  );
}
