"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateContentWithRetry = void 0;
const generative_ai_1 = require("@google/generative-ai");
const config_1 = __importDefault(require("../config/config"));
const API_KEYS = [
    config_1.default.GEMINI_API_KEY
];
let currentKeyIndex = 0;
const createModel = (apiKey) => {
    const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
};
let currentModel = createModel(API_KEYS[currentKeyIndex]);
const generateContentWithRetry = async (prompt, retries = 3) => {
    try {
        return await currentModel.generateContent(prompt);
    }
    catch (error) {
        const isQuotaError = error.statusCode === 429;
        if (isQuotaError && currentKeyIndex < API_KEYS.length - 1) {
            const retryAfter = error.retryDelaySeconds || 5;
            console.warn(`⚠️ Límite alcanzado con clave ${currentKeyIndex + 1}. Cambiando de clave...`);
            currentKeyIndex++;
            currentModel = createModel(API_KEYS[currentKeyIndex]);
            await new Promise((r) => setTimeout(r, retryAfter * 1000));
            return (0, exports.generateContentWithRetry)(prompt, retries);
        }
        if (isQuotaError && retries > 0) {
            console.warn(`⚠️ Todas las claves agotadas. Reintentando en 20s...`);
            await new Promise((r) => setTimeout(r, 20000));
            return (0, exports.generateContentWithRetry)(prompt, retries - 1);
        }
        if (isQuotaError || error.message?.includes("quota")) {
            console.error("❌ Sin cuota disponible para Gemini.");
            return { error: "IA sin cuota disponible. Intentá más tarde." };
        }
        console.error("❌ Error desconocido en Gemini:", error);
        return { error: "Ocurrió un error con el servicio de IA." };
    }
};
exports.generateContentWithRetry = generateContentWithRetry;
