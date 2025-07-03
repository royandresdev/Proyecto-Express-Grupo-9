import 'express';
import express from 'express';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import cookieParser from 'cookie-parser';
import router from './routes/index.routes';
import sequelize, { testConnection } from './lib/sequelize';
// import User from './models/User'; // Importa el modelo de usuario

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

app.use(express.json()); // Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.urlencoded({ extended: true })); // Middleware para parsear datos de formularios
app.use(cookieParser()); // Middleware para parsear cookies
app.use(morgan('dev'));

app.use('/', router); // Usa tu enrutador principal para todas las rutas

// Configuración básica de Socket.IO
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.on('chatMessage', (msg) => {
    console.log('Mensaje recibido:', msg);
    io.emit('chatMessage', { from: socket.id, message: msg });
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Inicia el servidor
server.listen(PORT, () => {
  console.log(`Servidor corriendo correctamente en http://localhost:${PORT}`);
});
