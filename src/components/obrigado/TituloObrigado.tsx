"use client";

import { useSyncExternalStore } from "react";
import { Heading } from "@/components/ui/Heading";
import { lerPrimeiroNome } from "@/lib/primeiro-nome";

const semMudancas = () => () => {};

function formatar(nome: string) {
  const palavra = nome.slice(0, 30);
  if (!palavra) return "";
  return (
    palavra[0].toLocaleUpperCase("pt-BR") +
    palavra.slice(1).toLocaleLowerCase("pt-BR")
  );
}

export function TituloObrigado() {
  const nome = formatar(
    useSyncExternalStore(semMudancas, lerPrimeiroNome, () => ""),
  );

  return (
    <Heading nivel={1} tamanho="hero">
      {nome ? `${nome}, falta só 1 passo!` : "Falta só 1 passo!"}
    </Heading>
  );
}
