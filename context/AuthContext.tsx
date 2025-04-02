import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
  isLoggedIn: boolean | null;
  login: (id: number, username: string, accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  getEmail: () => Promise<string>;
  setEmail: (email: string) => void;
  getAccessToken: () => Promise<string>;
  getRefreshToken: () => Promise<string>;
  getUser: () => Promise<{ id: number; username: string }>;
  setAccessToken: (accessToken: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  setUsername: (newUsername: string) => void;
  userId: number | null,
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem("access_token");
    setIsLoggedIn(!!token);
    if (isLoggedIn) {
      getUser().then(({id}) => setUserId(Number(id)));
    }
  };

  const login = async (id: number, username: string, accessToken: string, refreshToken: string) => {
    await Promise.all([
      AsyncStorage.setItem("access_token", accessToken),
      AsyncStorage.setItem("refresh_token", refreshToken),
      AsyncStorage.setItem("id", id.toString()),
      AsyncStorage.setItem("username", username),
    ]);
    setIsLoggedIn(true);
    setUserId(id);
  };

  const logout = async () => {
    await Promise.all([
      AsyncStorage.removeItem("access_token"),
      AsyncStorage.removeItem("refresh_token"),
      AsyncStorage.removeItem("id"),
      AsyncStorage.removeItem("username"),
    ]);
    setIsLoggedIn(false);
  };

  const getEmail = async () => {
    const email = await AsyncStorage.getItem("email");
    if (!email) throw new Error("Email not found");
    return email;
  };

  const setEmail = (email: string) => {
    AsyncStorage.setItem("email", email).catch(console.error);
  };

  const setAccessToken = (accessToken: string) => {
    AsyncStorage.setItem("access_token", accessToken).catch(console.error);
  };

  const setRefreshToken = (refreshToken: string) => {
    AsyncStorage.setItem("refresh_token", refreshToken).catch(console.error);
  };

  const getAccessToken = async () => {
    const token = await AsyncStorage.getItem("access_token");
    if (!token) throw new Error("Access token not found");
    return token;
  };

  const getRefreshToken = async () => {
    const token = await AsyncStorage.getItem("refresh_token");
    if (!token) throw new Error("Refresh token not found");
    return token;
  };

  const getUser = async () => {
    const [id, username] = await Promise.all([
      AsyncStorage.getItem("id"),
      AsyncStorage.getItem("username"),
    ]);
    if (!id || !username) throw new Error("User not found");
    return { id: Number(id), username };
  };

  const setUsername = (newUsername: string) => {
    AsyncStorage.setItem("username", newUsername).catch(console.error);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        getEmail,
        setEmail,
        getAccessToken,
        getRefreshToken,
        getUser,
        setAccessToken,
        setRefreshToken,
        setUsername,
        userId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};