"use client";
import React, { createContext, useContext, useState } from "react";

const UserContext = createContext<any>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<{ id: string; name: string }>(() => ({
    id: Math.random().toString(36).slice(2, 9),
    name: "Гость",
  }));
  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
