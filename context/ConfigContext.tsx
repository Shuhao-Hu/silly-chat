import React, { createContext, useContext, ReactNode } from "react";
import Constants from "expo-constants";

// Define the config interface
interface ConfigType {
  API_URL: string;
  SOCKET_URL: string;
  ENV: "development" | "release";
}

// Define separate configs for development and release
const devConfig: ConfigType = {
  API_URL: "http://localhost:3000",
  SOCKET_URL: "ws://localhost:3000/ws",
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
  return useContext(ConfigContext);
};

