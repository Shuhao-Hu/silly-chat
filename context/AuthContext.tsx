import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
  isLoggedIn: boolean | null,
  login: (id: number, username: string, accessToken: string, refreshToken: string) => Promise<void>,
  logout: () => Promise<void>,
  getAccessToken: () => Promise<string | null>,
  getRefreshToken: () => Promise<string | null>,
  getUser: () => Promise<{ id: number | null, username: string | null }>,
  setAccessToken: (accessToken: string) => Promise<void>,
  setRefreshToken: (refreshToken: string) => Promise<void>,
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem('userToken');
    setIsLoggedIn(!!token);
  }

  const login = async (id: number, username: string, accessToken: string, refreshToken: string) => {
    await AsyncStorage.setItem('access_token', accessToken);
    await AsyncStorage.setItem('refresh_token', refreshToken);
    await AsyncStorage.setItem('id', id.toString());
    await AsyncStorage.setItem('username', username);
    setIsLoggedIn(true);
  }

  const logout = async () => {
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('refresh_token');
    await AsyncStorage.removeItem('id');
    await AsyncStorage.removeItem('username');
    setIsLoggedIn(false);
  }

  const setAccessToken = async (accessToken: string) => {
    await AsyncStorage.setItem('access_token', accessToken);
  }

  const setRefreshToken = async (refreshToken: string) => {
    await AsyncStorage.setItem('refresh_token', refreshToken);
  }

  const getAccessToken = async () => {
    const token = await AsyncStorage.getItem('access_token');
    return token;
  }

  const getRefreshToken = async () => {
    const token = await AsyncStorage.getItem('refresh_token');
    return token;
  }

  const getUser = async () => {
    const id = Number(await AsyncStorage.getItem('id'));
    const username = await AsyncStorage.getItem('username');
    return { id, username };
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, getAccessToken, getRefreshToken, getUser, setAccessToken, setRefreshToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
