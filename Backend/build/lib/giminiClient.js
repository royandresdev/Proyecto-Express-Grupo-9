"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateContentWithRetry = exports.model = void 0;
const generative_ai_1 = require("@google/generative-ai");
const config_1 = __importDefault(require("../config/config"));
const genAI = new generative_ai_1.GoogleGenerativeAI(config_1.default.GEMINI_API_KEY);
exports.model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
const generateContentWithRetry = async (prompt, retries = 3) => {
    try {
        return await exports.model.generateContent(prompt);
    }
    catch (error) {
        if (error.statusCode === 429 && retries > 0) {
            const retryAfter = error.retryDelaySeconds || 20;
            console.log(`Rate limit exceeded, retrying in ${retryAfter}s...`);
            await new Promise(r => setTimeout(r, retryAfter * 1000));
            return (0, exports.generateContentWithRetry)(prompt, retries - 1);
        }
        throw error;
    }
};
exports.generateContentWithRetry = generateContentWithRetry;
