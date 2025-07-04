"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
if (!process.env.SECRET_CODE) {
    throw new Error("SECRET_CODE no está definido en el archivo .env");
}
const PORT = process.env.PORT || 3000;
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DATABASE = process.env.DB_DATABASE || 'railway';
const DB_PORT = process.env.DB_PORT;
const SECRET_CODE = process.env.SECRET_CODE;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_KEY_ALT1 = process.env.GEMINI_API_KEY;
const GEMINI_API_KEY_ALT2 = process.env.GEMINI_API_KEY;
exports.default = { PORT, DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT, SECRET_CODE, GEMINI_API_KEY, GEMINI_API_KEY_ALT1, GEMINI_API_KEY_ALT2 };
