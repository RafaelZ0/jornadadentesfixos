const DDDS_VALIDOS = new Set([
  11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35,
  37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 63, 64,
  65, 66, 67, 68, 69, 71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88,
  89, 91, 92, 93, 94, 95, 96, 97, 98, 99,
]);

export function somenteDigitos(valor: string) {
  const digitos = valor.replace(/\D/g, "");
  // Número colado com o código do país: +55 28 99999-9999.
  return digitos.length > 11 && digitos.startsWith("55")
    ? digitos.slice(2, 13)
    : digitos.slice(0, 11);
}

export function formatarWhatsapp(valor: string) {
  const d = somenteDigitos(valor);

  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function whatsappValido(valor: string) {
  const d = somenteDigitos(valor);
  return (
    d.length === 11 && DDDS_VALIDOS.has(Number(d.slice(0, 2))) && d[2] === "9"
  );
}
