"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analizarDecision = exports.analizarTono = void 0;
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
