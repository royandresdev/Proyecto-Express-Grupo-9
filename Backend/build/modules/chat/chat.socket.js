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
const socketIdToUserId = new Map();
let sugerenciaGeneral = null;
const registrarChatSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("Cliente conectado:", socket.id);
        socket.on("register", (data) => {
            const { user_id, nombre } = data;
            if (!usuariosActivos.has(user_id)) {
                usuariosActivos.set(user_id, {
                    nombre,
                    mensajes: [],
                    tonos: [],
                    decisiones: [],
                    claridad: [],
                });
                socketIdToUserId.set(socket.id, user_id);
                io.emit("chatMessage", {
                    from: "Sistema",
                    message: `🟢 El usuario "${nombre}" se ha unido al chat.`,
                });
            }
        });
        socket.on("chatMessage", async (data) => {
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
            user.mensajes.push({ texto: message, timestamp: Date.now() });
            dashboard.totalMensajes++;
            const tono = await (0, chatAnalitysisServices_1.analizarTono)(message);
            const decision = await (0, chatAnalitysisServices_1.analizarDecision)(message);
            const claridad = await (0, chatAnalitysisServices_1.analizarClaridad)(message);
            user.tonos.push(tono);
            user.claridad.push(claridad);
            dashboard.tonos[tono]++;
            if (decision !== "ninguna") {
                user.decisiones.push(decision);
                dashboard.decisiones[decision]++;
            }
            socket.broadcast.emit("chatMessage", { from: nombre, message });
            const mensajesRecientes = [...usuariosActivos.values()]
                .flatMap((user) => user.mensajes.map((m) => ({
                nombre: user.nombre,
                texto: m.texto,
            })))
                .slice(-20);
            const sugerencia = await (0, chatAnalitysisServices_1.analizarFeedbackConversacional)(mensajesRecientes);
            if (sugerencia && sugerencia !== sugerenciaGeneral) {
                sugerenciaGeneral = sugerencia;
            }
            if (sugerencia) {
                io.emit("chatMessage", {
                    from: "Asistente IA",
                    message: `🤖 ${sugerencia}`,
                });
            }
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
                        porcentaje,
                    };
                }),
                decisionesCantidad: {
                    resueltas: dashboard.decisiones.resuelta,
                    pendientes: dashboard.decisiones.pendiente,
                },
                claridadPorUsuario: [...usuariosActivos.entries()].map(([user_id, user]) => {
                    const total = user.claridad.length;
                    const porcentajes = { alta: 0, media: 0, baja: 0 };
                    user.claridad.forEach((nivel) => {
                        porcentajes[nivel]++;
                    });
                    Object.keys(porcentajes).forEach((clave) => {
                        const claveTyped = clave;
                        porcentajes[claveTyped] = total > 0
                            ? Math.round((porcentajes[claveTyped] / total) * 100)
                            : 0;
                    });
                    return {
                        user_id,
                        nombre: user.nombre,
                        claridad: porcentajes,
                    };
                }),
                sugerenciaGeneral,
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
exports.registrarChatSocket = registrarChatSocket;
