import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import { useApi } from "./ApiContext";
import { ActiveConversation, Contact, FriendRequest, Message } from "@/types/types";
import { useSQLiteContext } from "expo-sqlite";
import { insertMessage } from "@/db/sqlite";

interface FriendRequestContextType {
  friendRequests: FriendRequest[];
  setFriendRequests: React.Dispatch<React.SetStateAction<FriendRequest[]>>;
  refreshFriendRequests: () => Promise<void>;
  contacts: Contact[] | null,
  setContacts: React.Dispatch<React.SetStateAction<Contact[] | null>>;
  loadContacts: () => Promise<void>;
  activeConversations: ActiveConversation[] | null;
  setActiveConversations: React.Dispatch<React.SetStateAction<ActiveConversation[] | null>>;
  currentChatUserId: React.MutableRefObject<number>,
  messages: Message[],
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const FriendRequestContext = createContext<FriendRequestContextType | undefined>(undefined);

export const StateProvider = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn, getUser } = useAuth();
  const { fetchFriendRequests, fetchContacts, fetchUnreadMessages } = useApi();
  const [contacts, setContacts] = useState<Contact[] | null>(null);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [activeConversations, setActiveConversations] = useState<ActiveConversation[] | null>(null);
  const currentChatUserId = useRef(-1);
  const [messages, setMessages] = useState<Message[]>([]);
  const db = useSQLiteContext();

  const refreshActiveConversations = async () => {
    if (!isLoggedIn) return;
    const { id } = await getUser();
    if (id === null) {
      console.warn("id is null");
      return;
    }
    db.getAllAsync(
      "SELECT * FROM conversations WHERE user_id = ?",
      [id]
    ).then((conversations) => {
      setActiveConversations(conversations as ActiveConversation[]);
    });
  }

  const refreshFriendRequests = async () => {
    if (!isLoggedIn) return;
    const friendRequests = await fetchFriendRequests();
    setFriendRequests(friendRequests);
  }

  const loadContacts = async () => {
    if (!isLoggedIn) return;
    const contacts = await fetchContacts();
    setContacts(contacts);
  }

  const getUnreadMessages = async () => {
    const unreads = await fetchUnreadMessages();
    unreads.forEach((m) => insertMessage(db, m.sender_id, m.recipient_id, m.content, m.created_at, false).catch(console.error));
  }

  useEffect(() => {
    const refreshAllData = async () => {
      await getUnreadMessages();
      await refreshFriendRequests();
      await loadContacts();
      await refreshActiveConversations();
    };
    refreshAllData();
  }, [isLoggedIn]);

  return (
    <FriendRequestContext.Provider value={{
      friendRequests,
      setFriendRequests,
      contacts,
      setContacts,
      loadContacts,
      refreshFriendRequests,
      activeConversations,
      setActiveConversations,
      currentChatUserId,
      messages,
      setMessages,
    }}>
      {children}
    </FriendRequestContext.Provider>
  );
}

export const useStateContext = () => {
  const context = useContext(FriendRequestContext);
  if (!context) {
    throw new Error('useFriendRequests must be used within a StateProvider');
  }
  return context;
};
