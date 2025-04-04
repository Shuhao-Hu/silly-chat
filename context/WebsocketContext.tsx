import { createContext, useEffect, useRef } from "react";
import { useConfig } from "./ConfigContext";
import { Message, MessageDTO, WebSocketMessage } from "@/types/types";
import { useStateContext } from "./StateContext";
import { useAuth } from "./AuthContext";
import { insertMessage } from "@/db/sqlite";
import { useSQLiteContext } from "expo-sqlite";

interface WebsocketContextType {

}

const WebsocketContext = createContext<WebsocketContextType | undefined>(undefined);

export const WebsocketProvider = ({ children }: { children: React.ReactNode }) => {
  const ws = useRef<WebSocket | null>(null);
  const { refreshFriendRequests, currentChatUserId, setMessages } = useStateContext();
  const { isLoggedIn, getAccessToken } = useAuth();
  const db = useSQLiteContext();

  const { API_URL } = useConfig();
  let heartbeatInterval: NodeJS.Timeout;
  let reconnectInterval = 1000;

  useEffect(() => {
    const connectWebSocket = async () => {
      if (!isLoggedIn) return;

      const token = await getAccessToken();
      if (!token) return;

      const params = new URLSearchParams({ token });
      const WebsocketURL = `${API_URL}/ws?${params.toString()}`;

      ws.current = new WebSocket(WebsocketURL);

      ws.current.onopen = () => {
        console.log("WebSocket Connected");
        heartbeatInterval = setInterval(() => {
          if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.ping();
          }
        }, 45000);
      };

      ws.current.onmessage = (event) => {
        console.log(event.data);
        const data = JSON.parse(event.data) as WebSocketMessage;
        if (data.type === "dm") {
          const message = data.payload as MessageDTO;
          insertMessage(db, message.sender_id, message.recipient_id, message.content, message.created_at, currentChatUserId.current === message.recipient_id);
          console.log({currentChatUserId, message});
          if (currentChatUserId.current === message.sender_id) {
            setMessages(prev => [{
              sender_id: message.sender_id,
              recipient_id: message.recipient_id,
              timestamp: message.created_at,
              content: message.content,
              read: true,
            } as Message, ...prev],);
          }
        } else if (data.type === "friend_request") {
          console.log("refreshing friend requests");
          refreshFriendRequests();
        } else {
          console.log(`Unknown Message Type: ${data}`);
        }
      };

      ws.current.onclose = (event) => {
        console.log("WebSocket Disconnected:", event.code, event.reason);
        clearInterval(heartbeatInterval);
        setTimeout(connectWebSocket, reconnectInterval);
        reconnectInterval = Math.min(reconnectInterval * 2, 30000); // Exponential backoff
      };
    };

    connectWebSocket();

    return () => {
      ws.current?.close();
      clearInterval(heartbeatInterval);
    };
  }, [isLoggedIn]);

  return (
    <WebsocketContext.Provider value={{}}>
      {children}
    </WebsocketContext.Provider>
  );
}
