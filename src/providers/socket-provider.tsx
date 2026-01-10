import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import queryClient from "../config/query.client";
import { useAuthQuery } from "../hooks/auth/use-auth";
import { useSound } from "./sound-provider";

const backendBase = import.meta.env.VITE_BACKEND_BASE_URL ?? "http://localhost:5000";

interface SocketContextValue {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: FC<SocketProviderProps> = ({ children }) => {
  const { soundEnabled } = useSound();
  const { data: user } = useAuthQuery();
  const userId = user?._id;
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;

    const socketIo = io(backendBase, {
      withCredentials: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(socketIo);

    socketIo.emit("register-user", userId);

    const handleOnlineUsers = (users: string[]) => {
      queryClient.setQueryData(["onlineUsers"], users);
    };

    const handleUserOffline = (offlineUserId: string) => {
      queryClient.setQueryData(["onlineUsers"], (old: any[] = []) => old.filter((u) => u.id !== offlineUserId));
    };

    const handleNewNotification = async (notification: any) => {
      try {
        queryClient.invalidateQueries({ queryKey: ["my-notifications"] });

        queryClient.invalidateQueries({ queryKey: ["my-summary-notifications"] });

        if (soundEnabled) {
          const audio = new Audio("/notification-sound.mp3");
          audio.play().catch(() => console.log("Nie udało się odtworzyć dźwięku"));
        }
      } catch (err) {
        console.error("Wystąpił błąd podczas pobierania notyfikacji:", err);
      }
    };

    const handleNewArticle = async (notification: any) => {
      try {
        queryClient.invalidateQueries({ queryKey: ["articles"] });
        toast.info("Dodano nowy artykuł", {
          position: "bottom-right",
          description: (
            <span
              style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => window.open(notification.link, "_blank")}
            >
              Zobacz artykuł
            </span>
          ),
        });
        if (soundEnabled) {
          const audio = new Audio("/notification-sound.mp3");
          audio.play().catch(() => console.log("Nie udało się odtworzyć dźwięku"));
        }
      } catch (err) {
        console.error("Błąd przy fetchowaniu notyfikacji:", err);
      }
    };

    socketIo.on("online-users", handleOnlineUsers);
    socketIo.on("user-offline", handleUserOffline);
    socketIo.on("new-notification", handleNewNotification);
    socketIo.on("article_created", handleNewArticle);

    return () => {
      socketIo.off("online-users", handleOnlineUsers);
      socketIo.off("user-offline", handleUserOffline);
      socketIo.off("new-notification", handleNewNotification);

      socketIo.disconnect();
    };
  }, [userId, soundEnabled]);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error("useSocket must be used within a SocketProvider");
  return context;
};
