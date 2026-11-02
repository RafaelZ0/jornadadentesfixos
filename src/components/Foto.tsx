import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";

type FotoProps = {
  src: string;
  alt: string;
  sizes: string;
  /** Texto do espaço reservado enquanto o arquivo não existe. */
  reserva: string;
  className?: string;
};

export function temArquivo(src: string) {
  return existsSync(path.join(process.cwd(), "public", src));
}

export function Foto({ src, alt, sizes, reserva, className = "" }: FotoProps) {
  return (
    <figure className={`relative m-0 overflow-hidden rounded-card ${className}`}>
      {temArquivo(src) ? (
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      ) : (
        <div className="flex size-full items-center justify-center border-2 border-dashed border-edge bg-paper-2 p-4 text-center text-sm leading-[1.4] text-ink-2">
          {reserva}
        </div>
      )}
    </figure>
  );
}
