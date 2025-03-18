import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useApi } from "./ApiContext";
import { FriendRequest } from "@/types/types";

interface FriendRequestContextType {
  friendRequests: FriendRequest[];
  setFriendRequests: React.Dispatch<React.SetStateAction<FriendRequest[]>>;
  refreshFriendRequests: () => Promise<void>;
}

const FriendRequestContext = createContext<FriendRequestContextType | undefined>(undefined);

export const StateProvider = ({children}: {children: ReactNode}) => {
  const { isLoggedIn } = useAuth();
  const { fetchFriendRequests } = useApi();
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

  const refreshFriendRequests = async () => {
    if (!isLoggedIn) return;
    const friendRequests = await fetchFriendRequests();
    setFriendRequests(friendRequests);
  }

  useEffect(() => {
    refreshFriendRequests();

    const interval = setInterval(() => {
      refreshFriendRequests();
    }, 60000);

    return () => clearInterval(interval);
  }, [isLoggedIn]);
  
  return (
    <FriendRequestContext.Provider value={{ friendRequests, setFriendRequests, refreshFriendRequests}}>
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