"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrarChatSocket = void 0;
const chatAnalitysisServices_1 = require("./chatAnalitysisServices");
const usuariosActivos = new Map();
const dashboard = {
    totalMensajes: 0,
    tonos: { positivo: 0, neutro: 0, tenso: 0 },
    decisiones: { resuelta: 0, pendiente: 0 },
};
const registrarChatSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("Cliente conectado:", socket.id);
        socket.on("chatMessage", async (data) => {
            const { user_id, nombre, message } = data;
            if (!usuariosActivos.has(user_id)) {
                usuariosActivos.set(user_id, {
                    nombre,
                    mensajes: [],
                    tonos: [],
                    decisiones: [],
                });
            }
            const user = usuariosActivos.get(user_id);
            user.mensajes.push(message);
            dashboard.totalMensajes++;
            const tono = await (0, chatAnalitysisServices_1.analizarTono)(message);
            const decision = await (0, chatAnalitysisServices_1.analizarDecision)(message);
            user.tonos.push(tono);
            dashboard.tonos[tono]++;
            if (decision !== "ninguna") {
                user.decisiones.push(decision);
                dashboard.decisiones[decision]++;
            }
            io.emit("chatMessage", { from: nombre, message });
            io.emit("dashboardUpdate", {
                totalMensajes: dashboard.totalMensajes,
                tonosPorcentaje: Object.fromEntries(Object.entries(dashboard.tonos).map(([tono, cantidad]) => [
                    tono,
                    Math.round((cantidad / dashboard.totalMensajes) * 100) || 0,
                ])),
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
exports.registrarChatSocket = registrarChatSocket;
