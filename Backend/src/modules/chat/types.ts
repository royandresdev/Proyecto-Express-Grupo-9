export type Tono = "positivo" | "neutro" | "tenso";
export type Decision = "resuelta" | "pendiente" | "ninguna";

export interface UsuarioActivo {
  nombre: string;
  mensajes: string[];
  tonos: Tono[];
  decisiones: Decision[];
}

export interface Dashboard {
  totalMensajes: number;
  tonos: Record<Tono, number>;
  decisiones: Record<Exclude<Decision, "ninguna">, number>;
}
