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

    const naTela = new Set<Element>();

    const observador = new IntersectionObserver((entradas) => {
      for (const entrada of entradas) {
        if (entrada.isIntersecting) naTela.add(entrada.target);
        else naTela.delete(entrada.target);
      }
      const passouDoPrimeiro = lista[0].getBoundingClientRect().bottom < 0;
      setVisivel(passouDoPrimeiro && naTela.size === 0);
    });

    lista.forEach((formulario) => observador.observe(formulario));
    if (rodape) observador.observe(rodape);

    return () => observador.disconnect();
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
