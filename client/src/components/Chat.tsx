import { useState, type ChangeEvent, useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import Message from "./Message";
import { useAuthStore } from "@/store/auth.store";
import { useDashboardStore } from "@/store/dashboard.store";
import { Button } from "./ui/button";
import MessageIA from "./MessageIA";

// Definimos la URL del backend
const SOCKET_URL = import.meta.env.VITE_API_URL;

interface DashboardUpdate {
  totalMensajes: number;
  tonosPorcentaje: {
    positivo: number;
    neutro: number;
    tenso: number;
  };
  participacionPorUsuario: Array<{
    user_id: string;
    nombre: string;
    porcentaje: number;
  }>;
  decisionesCantidad: {
    resueltas: number;
    pendientes: number;
  };
  claridadPorUsuario: Array<{
    user_id: number;
    nombre: string;
    claridad: number;
  }>;
  sugerenciaGeneral: string | null;
}

interface ChatMessage {
  from: string;
  text: string;
  timeStamp: string;
}

function Chat() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const user = useAuthStore((state) => state.user);
  const setDashboard = useDashboardStore((state) => state.setDashboard);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleDashboardUpdate = useCallback((data: DashboardUpdate) => {
    setDashboard(data);
  }, [setDashboard]);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      setIsConnected(true);
      setIsReconnecting(false);

      if (user) {
        newSocket.emit("register", {
          user_id: user.id,
          nombre: user.username,
        });
      }
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    newSocket.on("reconnecting", () => {
      setIsReconnecting(true);
    });

    newSocket.on("reconnect_failed", () => {
      setIsReconnecting(false);
      setMessages((prev) => [
        ...prev,
        {
          from: "Sistema",
          text: "Error de conexión. Por favor, recarga la página.",
          timeStamp: new Date().toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
        },
      ]);
    });

    newSocket.on("chatMessage", (data: { from: string; message: string }) => {
      const now = new Date();
      const timestamp = now.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      console.log("data", data);
      setMessages((prev) => [
        ...prev,
        {
          from: data.from,
          text: data.message,
          timeStamp: timestamp,
        },
      ]);
    });

    newSocket.on("dashboardUpdate", handleDashboardUpdate);

    setSocket(newSocket);

    return () => {
      newSocket.removeListener("dashboardUpdate", handleDashboardUpdate);
      newSocket.close();
    };
  }, [user, handleDashboardUpdate]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && socket && user && isConnected) {
      setIsSending(true);
      try {
        const messageText = message.trim();
        socket.emit("chatMessage", {
          user_id: user.id,
          nombre: user.username,
          message: messageText,
        });

        // Agregar el mensaje localmente
        const now = new Date();
        const timestamp = now.toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

        setMessages((prev) => [
          ...prev,
          {
            from: user.username,
            text: messageText,
            timeStamp: timestamp,
          },
        ]);

        setMessage("");
      } catch (error) {
        console.log("error", error);
        // Mostrar error al enviar mensaje
        setMessages((prev) => [
          ...prev,
          {
            from: "Sistema",
            text: "Error al enviar el mensaje. Por favor, intenta de nuevo.",
            timeStamp: new Date().toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }),
          },
        ]);
      } finally {
        setIsSending(false);
      }
    }
  };

  return (
    <section className="flex flex-col py-2 flex-1">
      {/* Estado de conexión */}
      {!isConnected && (
        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 text-center">
          {isReconnecting ? "Reconectando..." : "Desconectado"}
        </div>
      )}

      <ul className="pl-2 pr-4 space-y-4 py-4 flex-1 overflow-y-auto">
        {messages.map((msg, index) => (
          <li key={index}>
            {
              msg.from === "Asistente IA" ? <MessageIA msg={msg.text} timeStamp={msg.timeStamp} /> :
                <Message
                  name={msg.from}
                  msg={msg.text}
                  timeStamp={msg.timeStamp}
                  isSystem={msg.from === "Sistema" || msg.from === "Asistente IA"}
                />}
          </li>
        ))}
        <div ref={messagesEndRef} />
      </ul>

      <form
        className="flex items-center gap-2 px-2 pt-4 pb-2 border-t border-[#a8a8a8]"
        onSubmit={handleSubmit}
      >
        <input
          className="px-4 py-2 border rounded w-full outline-[#a8a8a8] border-[#a8a8a8]"
          type="text"
          title="Escribe tu mensaje..."
          placeholder="Escribe tu mensaje..."
          value={message}
          onChange={handleInputChange}
          disabled={!isConnected || isSending}
        />
        <Button
          type="submit"
          disabled={!isConnected || isSending || !message.trim()}
        >
          {isSending ? "Enviando..." : "Enviar"}
        </Button>
      </form>
    </section>
  );
}

export default Chat;
