"use client";

import { useEffect } from "react";
import { rastrear } from "@/lib/pixel";

const ESPERA_MS = 10_000;

export function EventoInteresse() {
  useEffect(() => {
    const espera = setTimeout(
      () => rastrear("track", "ViewContent"),
      ESPERA_MS,
    );
    return () => clearTimeout(espera);
  }, []);

  return null;
}
