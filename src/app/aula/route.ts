import { evento } from "@/config/evento";
import { redirecionarPara } from "@/lib/redirecionar";

export function GET(pedido: Request) {
  return redirecionarPara(evento.youtube.aulaUrl, pedido);
}
