"use client";

import { useState, useEffect, useCallback } from "react";
import { Channel, User, SyncEvent } from "@/shared/types";
import { storage, STORAGE_KEYS } from "@/shared/lib/storage";
import { realtimeSync } from "@/shared/lib/realtime-sync";
import { useRealtimeSync } from "@/shared/hooks/use-realtime-sync";

function generateId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}

export function useChannels(currentUser: User | null) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);

  useEffect(() => {
    const saved = storage.get<Channel[]>(STORAGE_KEYS.CHANNELS) || [];
    setChannels(saved);

    if (saved.length > 0 && !activeChannelId) {
      const userChannel = saved.find((ch: Channel) => ch.members.some((m) => m.id === currentUser?.id));
      if (userChannel) setActiveChannelId(userChannel.id);
    }
  }, [currentUser]);

  const saveChannels = useCallback((newChannels: Channel[]) => {
    setChannels(newChannels);
    storage.set(STORAGE_KEYS.CHANNELS, newChannels);
  }, []);

  const handleSyncEvent = useCallback((event: SyncEvent) => {
    switch (event.type) {
      case "CHANNEL_CREATED":
        setChannels((prev) => {
          if (prev.find((ch) => ch.id === event.channel.id)) return prev;
          return [...prev, event.channel];
        });
        break;

      case "CHANNEL_JOINED":
        setChannels((prev) =>
          prev.map((ch) =>
            ch.id === event.channelId && !ch.members.find((m) => m.id === event.user.id)
              ? { ...ch, members: [...ch.members, event.user] }
              : ch
          )
        );
        break;

      case "MEMBER_REMOVED":
      case "CHANNEL_LEFT":
        setChannels((prev) =>
          prev.map((ch) =>
            ch.id === event.channelId ? { ...ch, members: ch.members.filter((m) => m.id !== event.userId) } : ch
          )
        );
        break;
    }
  }, []);

  useRealtimeSync(handleSyncEvent);

  const createChannel = (name: string, description?: string) => {
    if (!currentUser) return null;

    const channel: Channel = {
      id: generateId("channel"),
      name: name.trim(),
      description,
      creatorId: currentUser.id,
      members: [currentUser],
      createdAt: new Date().toISOString(),
      isPrivate: false,
    };

    const updated = [...channels, channel];
    saveChannels(updated);
    setActiveChannelId(channel.id);

    realtimeSync.broadcast({ type: "CHANNEL_CREATED", channel });

    return channel;
  };

  const joinChannel = (channelId: string) => {
    if (!currentUser) return;

    const updated = channels.map((ch) =>
      ch.id === channelId && !ch.members.find((m) => m.id === currentUser.id)
        ? { ...ch, members: [...ch.members, currentUser] }
        : ch
    );

    saveChannels(updated);
    setActiveChannelId(channelId);

    realtimeSync.broadcast({ type: "CHANNEL_JOINED", channelId, user: currentUser });
  };

  const leaveChannel = (channelId: string) => {
    if (!currentUser) return;

    const updated = channels.map((ch) =>
      ch.id === channelId ? { ...ch, members: ch.members.filter((m) => m.id !== currentUser.id) } : ch
    );

    saveChannels(updated);

    realtimeSync.broadcast({ type: "CHANNEL_LEFT", channelId, userId: currentUser.id });

    if (activeChannelId === channelId) setActiveChannelId(null);
  };

  const removeMember = (channelId: string, userId: string) => {
    const channel = channels.find((c) => c.id === channelId);
    if (!channel || channel.creatorId !== currentUser?.id) return;

    const updated = channels.map((ch) =>
      ch.id === channelId ? { ...ch, members: ch.members.filter((m) => m.id !== userId) } : ch
    );

    saveChannels(updated);

    realtimeSync.broadcast({ type: "MEMBER_REMOVED", channelId, userId });
  };

  const activeChannel = channels.find((ch) => ch.id === activeChannelId);
  const userChannels = channels.filter((ch) => ch.members.some((m) => m.id === currentUser?.id));
  const availableChannels = channels.filter((ch) => !ch.members.some((m) => m.id === currentUser?.id) && !ch.isPrivate);

  return {
    channels,
    activeChannel,
    activeChannelId,
    userChannels,
    availableChannels,
    setActiveChannelId,
    createChannel,
    joinChannel,
    leaveChannel,
    removeMember,
  };
}
