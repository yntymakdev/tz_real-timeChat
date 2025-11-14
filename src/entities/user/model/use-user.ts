"use client";

import { useState, useEffect } from "react";
import { User } from "@/shared/types";
import { storage, STORAGE_KEYS } from "@/shared/lib/storage";
import { generateId } from "@/shared/lib/utils";
import { realtimeSync } from "@/shared/lib/realtime-sync";

export function useUser() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = storage.get<User>(STORAGE_KEYS.USER);
    if (savedUser) {
      setCurrentUser(savedUser);
      realtimeSync.broadcast({
        type: "USER_ONLINE",
        userId: savedUser.id,
      });
    }

    return () => {
      if (savedUser) {
        realtimeSync.broadcast({
          type: "USER_OFFLINE",
          userId: savedUser.id,
        });
      }
    };
  }, []);

  const createUser = (name: string) => {
    const user: User = {
      id: generateId("user"),
      name: name.trim(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      online: true,
      createdAt: new Date().toISOString(),
    };

    storage.set(STORAGE_KEYS.USER, user);
    setCurrentUser(user);

    realtimeSync.broadcast({
      type: "USER_ONLINE",
      userId: user.id,
    });

    return user;
  };

  const logout = () => {
    if (currentUser) {
      realtimeSync.broadcast({
        type: "USER_OFFLINE",
        userId: currentUser.id,
      });
    }

    storage.remove(STORAGE_KEYS.USER);
    setCurrentUser(null);
  };

  return {
    currentUser,
    createUser,
    logout,
  };
}
