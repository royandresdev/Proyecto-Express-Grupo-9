export type Tono = "positivo" | "neutro" | "tenso";
export type Decision = "resuelta" | "pendiente" | "ninguna";


export interface Mensaje {
  texto: string;
  timestamp: number;
}
export interface UsuarioActivo {
  nombre: string;
  mensajes: Mensaje[];
  tonos: Tono[]; 
  decisiones: Decision[];
  claridad: ("alta" | "media" | "baja")[];
}

export interface Dashboard {
  totalMensajes: number;
  tonos: Record<Tono, number>;
  decisiones: Record<Exclude<Decision, "ninguna">, number>;
}
