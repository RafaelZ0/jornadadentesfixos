"use client";

import { useEffect } from "react";
import { enviarEvento } from "@/lib/rastreamento";

const ESPERA_MS = 10_000;

export function EventoInteresse() {
  useEffect(() => {
    const espera = setTimeout(() => enviarEvento("view_content"), ESPERA_MS);
    return () => clearTimeout(espera);
  }, []);

  return null;
}
