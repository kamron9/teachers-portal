import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/hooks/useAuth";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (user && isAuthenticated) {
      // Create socket connection with authentication
      const newSocket = io(
        process.env.NODE_ENV === "production"
          ? "https://your-production-url.com"
          : "http://localhost:3001",
        {
          auth: {
            userId: user.id,
          },
          transports: ["websocket"],
        },
      );

      newSocket.on("connect", () => {
        // Socket connected successfully
        setIsConnected(true);
      });

      newSocket.on("disconnect", () => {
        // Socket disconnected
        setIsConnected(false);
      });

      newSocket.on("connect_error", (error) => {
        if (import.meta.env.DEV) {
          console.error("Socket connection error:", error);
        }
        setIsConnected(false);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
        setSocket(null);
        setIsConnected(false);
      };
    }
  }, [user, isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
