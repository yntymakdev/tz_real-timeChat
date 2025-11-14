"use client";

import { useState, useEffect, useCallback } from "react";
import { Message } from "@/shared/types";
import { storage, STORAGE_KEYS } from "@/shared/lib/storage";
import { generateId } from "@/shared/lib/utils";
import { realtimeSync } from "@/shared/lib/realtime-sync";
import { useRealtimeSync } from "@/shared/hooks/use-realtime-sync";

export function useMessages() {
  const [messages, setMessages] = useState<Record<string, Message[]>>({});

  // Load messages
  useEffect(() => {
    const saved = (storage.get(STORAGE_KEYS.MESSAGES) || {}) as Record<string, Message[]>;
    setMessages(saved);
  }, []);

  // Save messages
const saveMessages = useCallback((newMessages: Record<string, Message[]>) => {
  setMessages(newMessages);
  storage.set(STORAGE_KEYS.MESSAGES, newMessages);
}, []);

  // Real-time sync
  const handleSyncEvent = useCallback((event: any) => {
    if (event.type === "MESSAGE_SENT") {
      setMessages((prev) => {
        const channelMessages = prev[event.message.channelId] || [];

        // Check if message already exists
        if (channelMessages.find((m) => m.id === event.message.id)) {
          return prev;
        }

        return {
          ...prev,
          [event.message.channelId]: [...channelMessages, event.message],
        };
      });
    }
  }, []);

  useRealtimeSync(handleSyncEvent);

  const sendMessage = useCallback(
    (channelId: string, userId: string, userName: string, userAvatar: string, text: string) => {
      const message: Message = {
        id: generateId("msg"),
        channelId,
        userId,
        userName,
        userAvatar,
        text: text.trim(),
        timestamp: new Date().toISOString(),
      };

      const updated = {
        ...messages,
        [channelId]: [...(messages[channelId] || []), message],
      };

      saveMessages(updated);

      realtimeSync.broadcast({
        type: "MESSAGE_SENT",
        message,
      });
    },
    [messages, saveMessages]
  );

  return {
    messages,
    sendMessage,
  };
}
