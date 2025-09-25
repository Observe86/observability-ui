"use client";

import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";

import { getAccessToken } from "@/utils/token";

type Company = {
  id: string;
  name: string;
};
type User = {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  username: string;
  role: Role;
};
export type Role = "ADMIN" | "USER" | "GUEST";

type GlobalStoreContextType = {
  company: Company | null;
  setCompany: (company: Company) => void;
  user: User | null;
  setUser: (user: User) => void;
};

const GlobalStoreContext = createContext<GlobalStoreContextType | undefined>(undefined);

export const useGlobalStore = () => {
  const context = useContext(GlobalStoreContext);
  if (context === undefined) {
    throw new Error("useGlobalStore must be used within a GlobalStoreProvider");
  }
  return context;
};

export const GlobalStoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const accessToken = getAccessToken();
    const decoded = accessToken ? (jwtDecode(accessToken) as any) : null;

    if (decoded) {
      setCompany({
        id: decoded.companyId,
        name: decoded.companyName,
      });

      setUser({
        id: decoded.userId,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        name: decoded.firstName + " " + decoded.lastName,
        email: decoded.email,
        username: decoded.username,
        role: decoded.role,
      });
    }
  }, []);

  return (
    <GlobalStoreContext.Provider value={{ company, setCompany, user, setUser }}>
      {children}
    </GlobalStoreContext.Provider>
  );
};
