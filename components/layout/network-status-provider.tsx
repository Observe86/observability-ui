"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface INetworkStatusContext {
  isOnline: boolean;
}

const NetworkStatusContext = createContext<INetworkStatusContext | undefined>(undefined);

export const NetworkStatusProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    console.log("isOnline: ", isOnline);
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);

    // Check the network status initially
    updateOnlineStatus();

    // Add event listeners for online and offline events
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  return (
    <NetworkStatusContext.Provider value={{ isOnline }}>{children}</NetworkStatusContext.Provider>
  );
};

export const useNetworkStatus = () => {
  const context = useContext(NetworkStatusContext);
  if (!context) {
    throw new Error("useNetworkStatus must be used within a NetworkStatusProvider");
  }
  return context;
};
