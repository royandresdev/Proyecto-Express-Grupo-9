"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analizarFeedbackConversacional = exports.analizarDecision = exports.analizarTono = void 0;
const giminiClient_1 = require("../../lib/giminiClient");
const analizarTono = async (mensaje) => {
    const prompt = `Analizá este mensaje y respondé solo si corresponde con: positivo neutro o tenso\n"${mensaje}"`;
    const result = await (0, giminiClient_1.generateContentWithRetry)(prompt);
    const texto = result.response.text().trim().toLowerCase();
    if (["positivo", "neutro", "tenso"].includes(texto)) {
        return texto;
    }
    return "neutro";
};
exports.analizarTono = analizarTono;
const analizarDecision = async (mensaje) => {
    const prompt = `¿Este mensaje representa una decisión? Respondé: resuelta, pendiente o ninguna.\n"${mensaje}"`;
    const result = await (0, giminiClient_1.generateContentWithRetry)(prompt);
    const texto = result.response.text().trim().toLowerCase();
    if (["resuelta", "pendiente"].includes(texto)) {
        return texto;
    }
    return "ninguna";
};
exports.analizarDecision = analizarDecision;
const analizarFeedbackConversacional = async (mensajes) => {
    const prompt = `
Sos un asistente inteligente para mejorar la comunicación de un equipo de desarrollo.

Analizá esta conversación y respondé **solo si detectás un problema grave o relevante** para mejorar, como:
- falta de respuesta o seguimiento importante,
- mensajes poco claros que dificulten el avance,
- tono tenso o conflictivo evidente,
- decisiones sin responsables claros que bloqueen el proyecto,
- mensajes cruzados o confusión significativa,
- falta de acuerdos o alineación que afecten el trabajo.

Ignorá mensajes triviales, saludos, cortesías o comentarios neutrales sin impacto en la dinámica del equipo.

Cuando respondas, sé breve, amable y constructivo, sugiriendo acciones claras para mejorar.

Si no hay nada relevante, respondé únicamente con la palabra exacta: "ninguna".

Conversación:
${mensajes.map((m, i) => `${i + 1}. ${m.nombre}: ${m.texto}`).join("\n")}

Sugerencia:
`.trim();
    const result = await (0, giminiClient_1.generateContentWithRetry)(prompt);
    const texto = result.response.text().trim();
    if (texto.toLowerCase() === "ninguna")
        return null;
    return texto;
};
exports.analizarFeedbackConversacional = analizarFeedbackConversacional;
