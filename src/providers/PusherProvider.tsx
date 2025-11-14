"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import Pusher from "pusher-js";
import { useUser } from "./UserProvider";

const PusherContext = createContext<any>(null);

export const PusherProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const [pusher, setPusher] = useState<any>(null);
  const [channels, setChannels] = useState<any[]>([
    { id: "general", name: "General", participants: [], messages: [], creatorId: "system" },
  ]);
  const [currentChannel, setCurrentChannel] = useState<string | null>(null);

  useEffect(() => {
    // init pusher client (public key)
    const p = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: "/api/pusher-auth",
    });
    setPusher(p);

    // subscribe to public channel list
    const publicChannel = p.subscribe("public-channels");
    publicChannel.bind("channels-updated", (data: any) => {
      const ch = data.channel;
      setChannels((prev) => {
        // avoid duplicates
        if (prev.find((c) => c.id === ch.id)) return prev;
        return [ch, ...prev];
      });
    });

    // If server triggers a full list sync, accept it
    publicChannel.bind("channels-sync", (data: any) => {
      if (Array.isArray(data.channels)) {
        setChannels((_) => data.channels);
      }
    });

    return () => {
      p.disconnect();
    };
  }, []);

  // Ensure getChannel always returns stable object with arrays
  const getChannel = (id?: string | null) => {
    if (!id) return null;
    const c = channels.find((x) => x.id === id) ?? null;
    if (!c) return null;
    return {
      ...c,
      participants: Array.isArray(c.participants) ? c.participants : [],
      messages: Array.isArray(c.messages) ? c.messages : [],
    };
  };

  const createChannel = async (name: string) => {
    if (!user) return;
    const id = Math.random().toString(36).slice(2, 9);
    const ch = { id, name, participants: [], messages: [], creatorId: user.id, createdAt: Date.now() };
    // optimistic update locally
    setChannels((prev) => [ch, ...prev]);

    // Notify server to broadcast channel to others
    await fetch("/api/pusher-trigger", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "createChannel", channel: ch }),
    });
  };

  const joinChannel = async (channelId: string) => {
    if (!pusher || !user) return;
    // subscribe to private channel
    const ch = pusher.subscribe(`private-${channelId}`);

    // new-message event
    const newMessageHandler = (data: any) => {
      const message = data.message;
      setChannels((prev) =>
        prev.map((c) => (c.id === channelId ? { ...c, messages: [...(c.messages || []), message] } : c))
      );
    };

    const participantsHandler = (data: any) => {
      setChannels((prev) => prev.map((c) => (c.id === channelId ? { ...c, participants: data.participants } : c)));
    };

    const userRemovedHandler = (data: any) => {
      setChannels((prev) =>
        prev.map((c) =>
          c.id === channelId
            ? { ...c, participants: (c.participants || []).filter((p: any) => p.id !== data.userId) }
            : c
        )
      );
    };

    ch.bind("new-message", newMessageHandler);
    ch.bind("participants", participantsHandler);
    ch.bind("user-removed", userRemovedHandler);

    // optimistic participants add (if not exists)
    setChannels((prev) =>
      prev.map((c) => {
        if (c.id === channelId) {
          const exists = (c.participants || []).some((p: any) => p.id === user.id);
          return { ...c, participants: exists ? c.participants : [...(c.participants || []), user] };
        }
        return c;
      })
    );

    // Notify server of participants update so others receive it
    await fetch("/api/pusher-trigger", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "participants-update",
        channelId,
        participants: [...(getChannel(channelId)?.participants ?? []), user],
      }),
    });

    setCurrentChannel(channelId);
  };

  const leaveChannel = async (channelId: string) => {
    if (!pusher || !user) return;
    pusher.unsubscribe(`private-${channelId}`);
    setChannels((prev) =>
      prev.map((c) =>
        c.id === channelId ? { ...c, participants: (c.participants || []).filter((p: any) => p.id !== user.id) } : c
      )
    );
    await fetch("/api/pusher-trigger", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "participants-update",
        channelId,
        participants: (getChannel(channelId)?.participants || []).filter((p: any) => p.id !== user.id),
      }),
    });
    setCurrentChannel(null);
  };

  // Standardized: sendMessage(channelId, text)
  const sendMessage = async (channelId: string, text: string) => {
    if (!user) return;
    const message = {
      id: Math.random().toString(36).slice(2, 9),
      text,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      timestamp: Date.now(),
    };
    // optimistic add
    setChannels((prev) =>
      prev.map((c) => (c.id === channelId ? { ...c, messages: [...(c.messages || []), message] } : c))
    );

    // tell server to broadcast
    await fetch("/api/pusher-trigger", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "message", channelId, message }),
    });
  };

  const removeUser = async (channelId: string, userId: string) => {
    setChannels((prev) =>
      prev.map((c) =>
        c.id === channelId ? { ...c, participants: (c.participants || []).filter((p: any) => p.id !== userId) } : c
      )
    );
    await fetch("/api/pusher-trigger", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "remove-user", channelId, userId }),
    });
  };

  return (
    <PusherContext.Provider
      value={{
        pusher,
        channels,
        createChannel,
        joinChannel,
        leaveChannel,
        sendMessage,
        currentChannel,
        removeUser,
        setChannels,
        getChannel,
      }}
    >
      {children}
    </PusherContext.Provider>
  );
};

export const usePusher = () => useContext(PusherContext);
