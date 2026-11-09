/**
 * event_id do CompleteRegistration, derivado do event_id do Lead.
 * Navegador e servidor calculam o mesmo valor, então a Meta deduplica os dois envios,
 * e ele nunca se confunde com o do Lead.
 */
export const idCompleteRegistration = (eventIdLead: string) =>
  `${eventIdLead}-cr`;
