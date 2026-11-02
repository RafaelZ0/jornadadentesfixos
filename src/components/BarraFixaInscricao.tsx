"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

function formularios() {
  return [...document.querySelectorAll<HTMLElement>("[data-lead-form]")];
}

function irParaFormularioMaisProximo() {
  const [maisProximo] = formularios().sort(
    (a, b) =>
      Math.abs(a.getBoundingClientRect().top) -
      Math.abs(b.getBoundingClientRect().top),
  );
  const movimentoReduzido = matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  maisProximo?.scrollIntoView({
    behavior: movimentoReduzido ? "auto" : "smooth",
    block: "center",
  });
}

export function BarraFixaInscricao() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const lista = formularios();
    const rodape = document.querySelector("footer");
    if (lista.length === 0) return;

    let quadro = 0;

    function naTela(elemento: Element) {
      const { top, bottom } = elemento.getBoundingClientRect();
      return top < window.innerHeight && bottom > 0;
    }

    function atualizar() {
      quadro = 0;
      const passouDoPrimeiro = lista[0].getBoundingClientRect().bottom < 0;
      const algoNaTela =
        lista.some(naTela) || (rodape !== null && naTela(rodape));
      setVisivel(passouDoPrimeiro && !algoNaTela);
    }

    // Rolagem, e não IntersectionObserver: uma rolagem rápida pode pular o formulário inteiro.
    function agendar() {
      quadro ||= requestAnimationFrame(atualizar);
    }

    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);

    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
    };
  }, []);

  if (!visivel) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-(--z-raised) border-t border-edge bg-paper px-(--gutter) pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
      <Button onClick={irParaFormularioMaisProximo}>
        Quero assistir à aula
      </Button>
    </div>
  );
}
