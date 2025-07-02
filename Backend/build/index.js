"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const index_routes_1 = __importDefault(require("./router/index.routes"));
const db_1 = require("./lib/db");
const app = (0, express_1.default)();
(0, db_1.testConnection)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*", // o especificá el front
        methods: ["GET", "POST"]
    }
});
const PORT = 3030;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use("/", index_routes_1.default);
io.on("connection", (socket) => {
    console.log("Cliente conectado:", socket.id);
    socket.on("chatMessage", (msg) => {
        console.log("Mensaje recibido:", msg);
        io.emit("chatMessage", { from: socket.id, message: msg });
    });
    socket.on("disconnect", () => {
        console.log("Cliente desconectado:", socket.id);
    });
});
server.listen(PORT, () => {
    console.log(`Servidor corriendo correctamente en la url http://localhost:${PORT}`);
});
