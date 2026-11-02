import type { FormatoVideo } from "@/config/evento";

// A altura máxima mantém o botão logo abaixo do vídeo dentro da tela do celular.
export const proporcoes: Record<FormatoVideo, string> = {
  "9:16": "aspect-[9/16] w-[min(100%,calc(60svh*9/16))]",
  "4:5": "aspect-[4/5] w-[min(100%,calc(60svh*4/5))]",
  "16:9": "aspect-video w-[min(100%,calc(60svh*16/9))]",
};
