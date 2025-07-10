import { Server } from "socket.io";
import {
  analizarTono,
  analizarDecision,
  analizarFeedbackConversacional,
  analizarClaridad,
} from "./chatAnalitysisServices";
import { UsuarioActivo, Dashboard } from "./types";

const usuariosActivos = new Map<string, UsuarioActivo>();

const dashboard: Dashboard = {
  totalMensajes: 0,
  tonos: { positivo: 0, neutro: 0, tenso: 0 },
  decisiones: { resuelta: 0, pendiente: 0 },
};

interface Message {
  user_id: string;
  nombre: string;
  message: string;
  timestamp: number;
}
interface Conversation {
  messages: Message[];
}

const conversationHistory: Conversation = {
  messages: [],
};

const socketIdToUserId = new Map<string, string>();
let sugerenciaGeneral: string | null = null;

export const registrarChatSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("Cliente conectado:", socket.id);

    // Recibe registro de usuario desde el cliente
    socket.on("register", (data: { user_id: string; nombre: string }) => {
      const { user_id, nombre } = data;

      // Verifica si el usuario ya está registrado
      if (!usuariosActivos.has(user_id)) {
        // Si no está registrado, lo agrega
        usuariosActivos.set(user_id, {
          nombre,
          mensajes: [],
          tonos: [],
          decisiones: [],
          claridad: [],
        });

        // Mapea el socket ID al user ID
        socketIdToUserId.set(socket.id, user_id);

        io.emit("chatMessage", {
          from: "Sistema",
          message: `🟢 El usuario "${nombre}" se ha unido al chat.`,
        });
      }
    });

    /*  socket.on(
      "chatMessage",
      async (data: { user_id: string; nombre: string; message: string }) => {
        const { user_id, nombre, message } = data;

        let user = usuariosActivos.get(user_id);
        if (!user) {
          user = {
            nombre,
            mensajes: [],
            tonos: [],
            decisiones: [],
            claridad: [],
          };
          usuariosActivos.set(user_id, user);
        }

        //user.mensajes.push({ texto: message, timestamp: Date.now() });
        //dashboard.totalMensajes++;

        const tono = await analizarTono(message);
        const decision = await analizarDecision(message);
        const claridad = await analizarClaridad(message);

        user.tonos.push(tono);
        user.claridad.push(claridad);

        dashboard.tonos[tono]++;
        if (decision !== "ninguna") {
          user.decisiones.push(decision);
          dashboard.decisiones[decision]++;
        }

        socket.broadcast.emit("chatMessage", { from: nombre, message });

        const mensajesRecientes = [...usuariosActivos.values()]
          .flatMap((user) =>
            user.mensajes.map((m) => ({
              nombre: user.nombre,
              texto: m.texto,
            }))
          )
          .slice(-20);

        const sugerencia = await analizarFeedbackConversacional(
          mensajesRecientes
        );

        if (sugerencia && sugerencia !== sugerenciaGeneral) {
          sugerenciaGeneral = sugerencia;
        }

        console.log(sugerencia);
        if (sugerencia) {
          io.emit("chatMessage", {
            from: "Asistente IA",
            message: `🤖 ${sugerencia}`,
          });
        }

        user.mensajes.push({
          texto: message,
          timestamp: Date.now(),          
        });
      
        dashboard.totalMensajes++;

        io.emit("dashboardUpdate", {
          totalMensajes: dashboard.totalMensajes,
          tonosPorcentaje: Object.fromEntries(
            Object.entries(dashboard.tonos).map(([tono, cantidad]) => [
              tono,
              Math.round((cantidad / dashboard.totalMensajes) * 100) || 0,
            ])
          ),
          participacionPorUsuario: [...usuariosActivos.entries()].map(
            ([user_id, user]) => {
              const porcentaje = Math.round(
                (user.mensajes.length / dashboard.totalMensajes) * 100
              );
              return {
                user_id,
                nombre: user.nombre,
                porcentaje,
              };
            }
          ),
          decisionesCantidad: {
            resueltas: dashboard.decisiones.resuelta,
            pendientes: dashboard.decisiones.pendiente,
          },
          claridadPorUsuario: [...usuariosActivos.entries()].map(
            ([user_id, user]) => {
              const total = user.claridad.length;
              // Si no hay mensajes, devolvemos 0 como claridad
              if (total === 0) {
                return {
                  user_id,
                  nombre: user.nombre,
                  claridad: 0,
                };
              }

              // Calculamos el promedio de claridad
              const promedioClaridad = Math.round(
                user.claridad.reduce((sum, valor) => sum + valor, 0) / total
              );

              return {
                user_id,
                nombre: user.nombre,
                claridad: promedioClaridad,
              };
            }
          ),
          sugerenciaGeneral,
        });
      }
    ); */

    socket.on(
      "chatMessage",
      async (data: { user_id: string; nombre: string; message: string }) => {
        // Aquí se recibe el mensaje del cliente y se agrega al historial de conversación
        conversationHistory.messages.push({ ...data, timestamp: Date.now() });

        // Actualiza la cantidad de mensajes del dashboard con el nuevo mensaje
        dashboard.totalMensajes = conversationHistory.messages.length;

        // Analiza la conversación para obtener alguna sugerencia si es necesario
        const sugerencia = await analizarFeedbackConversacional(
          conversationHistory.messages.map((m) => ({
            nombre: m.nombre,
            texto: m.message,
          }))
        );

        // Si hay una sugerencia la emitimos al cliente y la agregamos al historial de conversación
        if (sugerencia) {
          io.emit("chatMessage", {
            from: "Asistente IA",
            message: `🤖 ${sugerencia}`,
          });

          conversationHistory.messages.push({
            user_id: "ia",
            nombre: "Asistente IA",
            message: sugerencia,
            timestamp: Date.now(),
          });
        }

        io.emit("dashboardUpdate", {
          totalMensajes: dashboard.totalMensajes,
          tonosPorcentaje: Object.fromEntries(
            Object.entries(dashboard.tonos).map(([tono, cantidad]) => [
              tono,
              Math.round((cantidad / dashboard.totalMensajes) * 100) || 0,
            ])
          ),
          participacionPorUsuario: [...usuariosActivos.entries()].map(
            ([user_id, user]) => {
              const porcentaje = Math.round(
                (user.mensajes.length / dashboard.totalMensajes) * 100
              );
              return {
                user_id,
                nombre: user.nombre,
                porcentaje,
              };
            }
          ),
          decisionesCantidad: {
            resueltas: dashboard.decisiones.resuelta,
            pendientes: dashboard.decisiones.pendiente,
          },
          claridadPorUsuario: [...usuariosActivos.entries()].map(
            ([user_id, user]) => {
              const total = user.claridad.length;
              // Si no hay mensajes, devolvemos 0 como claridad
              if (total === 0) {
                return {
                  user_id,
                  nombre: user.nombre,
                  claridad: 0,
                };
              }

              // Calculamos el promedio de claridad
              const promedioClaridad = Math.round(
                user.claridad.reduce((sum, valor) => sum + valor, 0) / total
              );

              return {
                user_id,
                nombre: user.nombre,
                claridad: promedioClaridad,
              };
            }
          ),
          sugerenciaGeneral,
        });
      }
    );

    socket.on("disconnect", () => {
      const user_id = socketIdToUserId.get(socket.id);
      if (user_id) {
        const user = usuariosActivos.get(user_id);
        if (user) {
          io.emit("chatMessage", {
            from: "Sistema",
            message: `🔴 El usuario "${user.nombre}" se ha desconectado.`,
          });
          usuariosActivos.delete(user_id);
        }
        socketIdToUserId.delete(socket.id);
      }
      console.log("Cliente desconectado:", socket.id);
    });
  });
};
