import { Server } from "socket.io";
import { analizarTono, analizarDecision } from "./chatAnalitysisServices";
import { UsuarioActivo, Dashboard } from "./types.js";

const usuariosActivos = new Map<string, UsuarioActivo>();

const dashboard: Dashboard = {
  totalMensajes: 0,
  tonos: { positivo: 0, neutro: 0, tenso: 0 },
  decisiones: { resuelta: 0, pendiente: 0 },
};

export const registrarChatSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("Cliente conectado:", socket.id);

    socket.on("chatMessage", async (data: { user_id: string; nombre: string; message: string }) => {
      const { user_id, nombre, message } = data;

      if (!usuariosActivos.has(user_id)) {
        usuariosActivos.set(user_id, {
          nombre,
          mensajes: [],
          tonos: [],
          decisiones: [],
        });
      }

      const user = usuariosActivos.get(user_id)!;
      user.mensajes.push(message);
      dashboard.totalMensajes++;

      const tono = await analizarTono(message);
      const decision = await analizarDecision(message);

      user.tonos.push(tono);
      dashboard.tonos[tono]++;

      if (decision !== "ninguna") {
        user.decisiones.push(decision);
        dashboard.decisiones[decision]++;
      }

      io.emit("chatMessage", { from: nombre, message });

      io.emit("dashboardUpdate", {
        totalMensajes: dashboard.totalMensajes,
        tonosPorcentaje: Object.fromEntries(
    Object.entries(dashboard.tonos).map(([tono, cantidad]) => [
      tono,
      Math.round((cantidad / dashboard.totalMensajes) * 100) || 0,
    ])
  ),
  participacionPorUsuario: [...usuariosActivos.entries()].map(([user_id, user]) => {
    const porcentaje = Math.round((user.mensajes.length / dashboard.totalMensajes) * 100);
    return {
      user_id,
      nombre: user.nombre,
      porcentaje
    };
  }),
});
});
    socket.on("disconnect", () => {
      console.log("Cliente desconectado:", socket.id);
    });
  });
};
