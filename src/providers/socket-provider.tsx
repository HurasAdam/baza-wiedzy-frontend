import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import queryClient from "../config/query.client";
import { useAuthQuery } from "../hooks/auth/use-auth";

const backendBase = import.meta.env.VITE_BACKEND_BASE_URL ?? "http://localhost:5000";

interface SocketContextValue {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useAuthQuery();
  const userId = user?._id;

  useEffect(() => {
    const socketIo = io(backendBase, { withCredentials: true });
    setSocket(socketIo);

    socketIo.emit("user-login", { userId });

    socketIo.on("online-users", (users: any[]) => {
      queryClient.setQueryData(["onlineUsers"], users);
    });

    socketIo.on("user-offline", (userId) => {
      queryClient.setQueryData(["onlineUsers"], (old: any[] = []) => old.filter((u) => u.id !== userId));
    });

    socketIo.on("new-notification", (notification) => {
      console.log("Otrzymano nowe powiadomienie:", notification);

      toast.info("Dodano nowy artykuł", { position: "top-right" });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });

    return () => {
      socketIo.disconnect();
    };
  }, [queryClient]);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error("useSocket must be used within a SocketProvider");
  return context;
};
