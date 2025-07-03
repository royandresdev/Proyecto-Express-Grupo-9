import "express";
import express  from "express";
import http from "http";
import {Server as SocketIO} from "socket.io";
import cookieParser from 'cookie-parser';
import router from "./router/index.routes";
import { testConnection } from './lib/db';
import {registrarChatSocket} from "../src/modules/chat/chat.socket"


const app = express();
testConnection()
const server =http.createServer(app);
const io = new SocketIO(server,{
    cors: {
    origin: "*", 
    methods:  ["GET", "POST"]
  }
})

registrarChatSocket(io)
const PORT = 3000

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use("/", router);

server.listen(PORT, () => {
  console.log(`Servidor corriendo correctamente en la url http://localhost:${PORT}`);
});
