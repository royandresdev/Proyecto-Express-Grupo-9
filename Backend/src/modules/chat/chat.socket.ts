import { Server } from "socket.io";
import {
  analizarTono,
  analizarFeedbackConversacional,
  analizarClaridad,
} from "./chatAnalitysisServices";
import { UsuarioActivo, Dashboard, UserMessageCount } from "./types";

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
  tone?: "positivo" | "neutro" | "tenso";
}
interface Conversation {
  generalTone: { positivo: number; neutro: number; tenso: number };
  messages: Message[];
}

const conversationHistory: Conversation = {
  generalTone: { positivo: 0, neutro: 0, tenso: 0 },
  messages: [],
};

const socketIdToUserId = new Map<string, string>();

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

    socket.on("chatMessage", async (data: Message) => {
      const receivedMessage = { ...data, timestamp: Date.now() };
      const toneMessage = await analizarTono(receivedMessage.message);
      const clarityConversation = await analizarClaridad(
        conversationHistory.messages.map((m) => ({
          nombre: m.nombre,
          texto: m.message,
        }))
      );
      receivedMessage.tone = toneMessage;

      conversationHistory.messages.push(receivedMessage);

      // Actualiza la cantidad de mensajes del dashboard con el nuevo mensaje
      dashboard.totalMensajes = conversationHistory.messages.length;

      // Analiza la conversación para obtener alguna sugerencia si es necesario
      const sugerencia = await analizarFeedbackConversacional(
        conversationHistory.messages.map((m) => ({
          nombre: m.nombre,
          texto: m.message,
        }))
      );

      const titleSuggestion = sugerencia?.split("\n")[0];
      const descriptionSuggestion = sugerencia?.split("\n")[1];

      console.log("Sugerencia:", sugerencia);
      // Si hay una sugerencia la emitimos al cliente y la agregamos al historial de conversación
      if (sugerencia) {
        io.emit("chatMessage", {
          from: "Asistente IA",
          message: `🤖 ${descriptionSuggestion}`,
        });

        conversationHistory.messages.push({
          user_id: "ia",
          nombre: "Asistente IA",
          message: descriptionSuggestion || sugerencia,
          timestamp: Date.now(),
        });
      }

      const calculatePercentageTones = (): {
        positivo: number;
        neutro: number;
        tenso: number;
      } => {
        const totalMessages = conversationHistory.messages.filter(
          (m) => m.user_id !== "ia"
        ).length;
        if (totalMessages === 0) return { positivo: 0, neutro: 0, tenso: 0 };

        return {
          positivo: Math.round(
            (conversationHistory.messages.filter((m) => m.tone === "positivo")
              .length /
              totalMessages) *
              100
          ),
          neutro: Math.round(
            (conversationHistory.messages.filter((m) => m.tone === "neutro")
              .length /
              totalMessages) *
              100
          ),
          tenso: Math.round(
            (conversationHistory.messages.filter((m) => m.tone === "tenso")
              .length /
              totalMessages) *
              100
          ),
        };
      };

      function calculateParticipationByUser() {
        // Calcula la cantidad de mensajes en la conversación
        const totalMessages = conversationHistory.messages.filter(
          (m) => m.user_id !== "ia"
        ).length;

        // Si no hay mensajes, devolvemos un array vacío
        if (totalMessages === 0) return [];

        // Calcula la cantidad de mensajes por usuario
        const countMessagesPerUser = conversationHistory.messages.reduce(
          (acc: UserMessageCount, message: Message) => {
            if (message.user_id === "ia") return acc; // Ignora mensajes de IA

            if (!acc[message.nombre]) {
              acc[message.nombre] = 1;
            } else {
              acc[message.nombre]++;
            }

            return acc;
          },
          {} as UserMessageCount
        );

        // Mapea los resultados a un array de objetos con user_id, nombre y porcentaje
        return Object.entries(countMessagesPerUser).map(
          ([nombre, count]: [string, number]) => {
            const user_id =
              conversationHistory.messages.find((m) => m.nombre === nombre)
                ?.user_id || "desconocido";

            return {
              user_id,
              nombre,
              porcentaje: Math.round((count / totalMessages) * 100),
            };
          }
        );
      }

      io.emit("dashboardUpdate", {
        totalMensajes: dashboard.totalMensajes,
        tonosPorcentaje: calculatePercentageTones(),
        participacionPorUsuario: calculateParticipationByUser(),
        decisionesCantidad: {
          resueltas: dashboard.decisiones.resuelta,
          pendientes: dashboard.decisiones.pendiente,
        },
        clarityConversation,
        sugerenciaGeneral: titleSuggestion,
      });
    });

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
