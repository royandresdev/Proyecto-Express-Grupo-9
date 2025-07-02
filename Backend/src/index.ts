import "express";
import express  from "express";
import http from "http";
import {Server as SocketIO} from "socket.io";
import cookieParser from 'cookie-parser';
import router from "./router/index.routes";


const app = express();
const server =http.createServer(app);
const io = new SocketIO(server,{
    cors: {
    origin: "*", // o especificá el front
    methods:  ["GET", "POST"]
  }
})
const PORT = 3030

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use("/", router);

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
