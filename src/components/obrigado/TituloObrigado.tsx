"use client";

import { useSearchParams } from "next/navigation";
import { Heading } from "@/components/ui/Heading";

function primeiroNome(nome: string | null) {
  const palavra = nome?.trim().split(/\s+/)[0].slice(0, 30);
  if (!palavra) return "";
  return palavra[0].toLocaleUpperCase("pt-BR") + palavra.slice(1).toLocaleLowerCase("pt-BR");
}

export function TituloObrigado() {
  const nome = primeiroNome(useSearchParams().get("nome"));

  return (
    <Heading nivel={1} tamanho="hero">
      {nome ? `${nome}, falta só 1 passo!` : "Falta só 1 passo!"}
    </Heading>
  );
}
