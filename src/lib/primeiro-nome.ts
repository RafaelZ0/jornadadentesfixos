const CHAVE = "jornada_primeiro_nome";

// Fica só no navegador da pessoa: na URL, o nome seria enviado à Meta pelo Pixel.
export function guardarPrimeiroNome(nome: string) {
  try {
    sessionStorage.setItem(CHAVE, nome.trim().split(/\s+/)[0]);
  } catch {
    // Sem armazenamento: a página de obrigado mostra o título sem o nome.
  }
}

export function lerPrimeiroNome() {
  try {
    return sessionStorage.getItem(CHAVE) ?? "";
  } catch {
    return "";
  }
}
