import 'express';
import express from 'express';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import cookieParser from 'cookie-parser';
import router from "./routes/index.routes";
import sequelize, { testConnection } from './lib/sequelize';
import {registrarChatSocket} from "../src/modules/chat/chat.socket"

// Importa la configuración para acceder al PORT del .env
import config from './config/config';
import morgan from 'morgan';
const app = express();
const PORT = config.PORT; // Usa el puerto de tu archivo de configuración

// Prueba la conexión a la base de datos
testConnection();

// Sincroniza los modelos con la base de datos.
// Esto creará o actualizará la tabla `users` según el modelo `User`.
// ¡PRECAUCIÓN! En producción, considera usar migraciones de Sequelize en lugar de `sync({ alter: true })`
sequelize
  .sync({ force: true })
  .then(() => {
    console.log('Modelos sincronizados con la base de datos.');
  })
  .catch((error) => {
    console.error('Error al sincronizar modelos:', error);
  });

const server = http.createServer(app);
const io = new SocketIO(server, {
  cors: {
    origin: '*', // Permite cualquier origen (ajusta para producción)
    methods: ['GET', 'POST'],
  },
});
registrarChatSocket(io)
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(morgan('dev'));
app.use("/", router);


server.listen(PORT, () => {
  console.log(`Servidor corriendo correctamente en http://localhost:${PORT}`);
});
