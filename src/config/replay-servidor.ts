// Só o servidor lê este arquivo. Assim o ID do replay não vai junto no JavaScript das páginas
// e, depois do prazo, não aparece em lugar nenhum do site.
export const videoReplayId = process.env.NEXT_PUBLIC_REPLAY_VIDEO_ID ?? "";
