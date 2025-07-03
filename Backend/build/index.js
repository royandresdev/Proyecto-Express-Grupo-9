"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const index_routes_1 = __importDefault(require("./routes/index.routes"));
const sequelize_1 = __importStar(require("./lib/sequelize"));
const chat_socket_1 = require("./modules/chat/chat.socket");
// Importa la configuración para acceder al PORT del .env
const config_1 = __importDefault(require("./config/config"));
const morgan_1 = __importDefault(require("morgan"));
const app = (0, express_1.default)();
const PORT = config_1.default.PORT; // Usa el puerto de tu archivo de configuración
// Prueba la conexión a la base de datos
(0, sequelize_1.testConnection)();
// Sincroniza los modelos con la base de datos.
// Esto creará o actualizará la tabla `users` según el modelo `User`.
// ¡PRECAUCIÓN! En producción, considera usar migraciones de Sequelize en lugar de `sync({ alter: true })`
sequelize_1.default
    .sync({ force: true })
    .then(() => {
    console.log('Modelos sincronizados con la base de datos.');
})
    .catch((error) => {
    console.error('Error al sincronizar modelos:', error);
});
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*', // Permite cualquier origen (ajusta para producción)
        methods: ['GET', 'POST'],
    },
});
(0, chat_socket_1.registrarChatSocket)(io);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use("/", index_routes_1.default);
server.listen(PORT, () => {
    console.log(`Servidor corriendo correctamente en http://localhost:${PORT}`);
});
