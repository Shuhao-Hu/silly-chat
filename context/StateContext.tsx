import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useApi } from "./ApiContext";
import { ActiveConversation, Contact, FriendRequest } from "@/types/types";
import { useSQLiteContext } from "expo-sqlite";

interface FriendRequestContextType {
  friendRequests: FriendRequest[];
  setFriendRequests: React.Dispatch<React.SetStateAction<FriendRequest[]>>;
  refreshFriendRequests: () => Promise<void>;
  contacts: Contact[] | null,
  setContacts: React.Dispatch<React.SetStateAction<Contact[] | null>>;
  loadContacts: () => Promise<void>;
  activeConversations: ActiveConversation[] | null;
  setActiveConversations: React.Dispatch<React.SetStateAction<ActiveConversation[] | null>>;
}

const FriendRequestContext = createContext<FriendRequestContextType | undefined>(undefined);

export const StateProvider = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn, getUser } = useAuth();
  const { fetchFriendRequests, fetchContacts } = useApi();
  const [contacts, setContacts] = useState<Contact[] | null>(null);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [activeConversations, setActiveConversations] = useState<ActiveConversation[] | null>(null);
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

  useEffect(() => {
    const refreshAllData = async () => {
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
