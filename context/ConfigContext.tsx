import React, { createContext, useContext, ReactNode } from "react";
import Constants from "expo-constants";
import { Platform } from "react-native";

// Define the config interface
interface ConfigType {
  API_URL: string;
  SOCKET_URL: string;
  ENV: "development" | "release";
}

// Define separate configs for development and release
const devConfig: ConfigType = {
  API_URL: Platform.OS === "android" ? "http://10.0.2.2:5286" : "http://localhost:5286",
  SOCKET_URL: Platform.OS === "android" ? "ws://10.0.2.2:5286/ws" : "ws://localhost:5286/ws",
  ENV: "development",
};

const releaseConfig: ConfigType = {
  API_URL: "https://api.yourapp.com",
  SOCKET_URL: "wss://api.yourapp.com",
  ENV: "release",
};

// Choose config based on environment
const ConfigContext = createContext<ConfigType>(
  Constants.expoConfig?.extra?.ENV === "release" ? releaseConfig : devConfig
);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ConfigContext.Provider value={Constants.expoConfig?.extra?.ENV === "release" ? releaseConfig : devConfig}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = (): ConfigType => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within an ConfigProvider");
  }
  return context;
};

