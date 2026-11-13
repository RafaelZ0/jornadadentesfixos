// Só no servidor. A Vercel define VERCEL_ENV como production, preview ou development;
// no computador (next dev) ela não existe. Só o site publicado em produção conta como produção.
export const emProducao = process.env.VERCEL_ENV === "production";
