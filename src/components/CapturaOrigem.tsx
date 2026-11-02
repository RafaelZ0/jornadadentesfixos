"use client";

import { useEffect } from "react";
import { capturarOrigem } from "@/lib/origem";

export function CapturaOrigem() {
  useEffect(capturarOrigem, []);
  return null;
}
