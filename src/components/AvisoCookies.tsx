"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { evento } from "@/config/evento";
import { aceitarCookies, useAceitouCookies } from "@/lib/consentimento";

const PROTEGIDOS = "main a[href^='#'], main a[href*='whatsapp'], main button, main [data-lead-form]";
const ALTURA_ESTIMADA = 130;

export function AvisoCookies() {
  const rota = usePathname();
  const aceitou = useAceitouCookies();
  const aviso = useRef<HTMLDivElement>(null);
  const [posicao, setPosicao] = useState<number | null>(null);

  useEffect(() => {
    if (aceitou) return;

    let quadro = 0;

    function atualizar() {
      quadro = 0;
      const barra = document.querySelector<HTMLElement>("[data-barra-fixa]");
      const base = barra?.offsetHeight ?? 0;
      const altura = aviso.current?.offsetHeight ?? ALTURA_ESTIMADA;
      const fim = window.innerHeight - base;
      const inicio = fim - altura;

      // O aviso espera enquanto um botão ou formulário estiver na faixa que ele ocuparia.
      const cobriria = [...document.querySelectorAll(PROTEGIDOS)].some((item) => {
        if (item.closest("[data-barra-fixa]")) return false;
        const { top, bottom } = item.getBoundingClientRect();
        return top < fim && bottom > inicio;
      });

      setPosicao(cobriria ? null : base);
    }

    function agendar() {
      quadro ||= requestAnimationFrame(atualizar);
    }

    agendar();
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
    window.addEventListener("barra-fixa", agendar);

    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
      window.removeEventListener("barra-fixa", agendar);
    };
  }, [aceitou, rota]);

  if (aceitou || posicao === null) return null;

  return (
    <div
      ref={aviso}
      role="region"
      aria-label="Aviso de cookies"
      style={{ bottom: posicao }}
      className="fixed inset-x-0 z-(--z-raised) border-t border-edge bg-surface py-3"
    >
      <div className="mx-auto flex w-full max-w-[calc(var(--container)+2*var(--gutter))] items-center gap-4 px-(--gutter)">
        <p className="min-w-0 flex-1 text-xs leading-[1.4] text-ink">
          Usamos cookies para medir a divulgação da aula. Saiba mais na{" "}
          <Link
            href={evento.rotas.privacidade}
            className="text-accent underline underline-offset-4"
          >
            Privacidade
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={aceitarCookies}
          className="min-h-14 shrink-0 cursor-pointer rounded-control border-2 border-edge bg-surface px-4 text-md font-bold text-ink transition-colors duration-(--dur-micro) ease-out hover:bg-paper-2 active:bg-paper-3"
        >
          Entendi
        </button>
      </div>
    </div>
  );
}
