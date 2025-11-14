"use client";

import { User, Channel } from "@/shared/types";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CreateChannelDialog } from "@/features/create-channel/ui/create-channel-dialog";
import { JoinChannelDialog } from "@/features/join-channel/ui/join-channel-dialog";
import { getInitials } from "@/shared/lib/utils";
import { Hash, LogOut, Crown } from "lucide-react";

interface SidebarProps {
  currentUser: User;
  channels: Channel[];
  activeChannelId: string | null;
  availableChannels: Channel[];
  onChannelSelect: (id: string) => void;
  onCreateChannel: (name: string, description?: string) => void;
  onJoinChannel: (channelId: string) => void;
  onLogout: () => void;
}

export function Sidebar({
  currentUser,
  channels,
  activeChannelId,
  availableChannels,
  onChannelSelect,
  onCreateChannel,
  onJoinChannel,
  onLogout,
}: SidebarProps) {
  return (
    <div className="w-64 bg-slate-900 text-slate-200 h-full flex flex-col border-r border-slate-800">
      {/* User Profile */}
      <div className="p-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={currentUser.avatar || ""} alt={currentUser.name} />
            <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <span className="font-semibold">{currentUser.name}</span>
            <span className="text-xs text-green-400">Online</span>
          </div>
        </div>

        <Button variant="ghost" size="icon" onClick={onLogout} className="text-slate-400 hover:text-white">
          <LogOut className="w-5 h-5" />
        </Button>
      </div>

      {/* Actions */}
      <div className="p-4 flex flex-col gap-2 border-b border-slate-800">
        <CreateChannelDialog onCreate={onCreateChannel} />
        <JoinChannelDialog channels={availableChannels} onJoin={onJoinChannel} />{" "}
      </div>

      {/* Channels List */}
      <div className="flex-1 p-2">
        <h3 className="text-sm font-semibold text-slate-400 px-2 mb-2">Your Channels</h3>

        <ScrollArea className="h-full">
          {channels.length === 0 ? (
            <p className="text-sm text-slate-500 px-2">No channels yet</p>
          ) : (
            channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => onChannelSelect(channel.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition group ${
                  activeChannelId === channel.id ? "bg-indigo-600 text-white" : "hover:bg-slate-800 text-slate-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 opacity-70" />
                  <span>{channel.name}</span>
                </div>

                {channel.creatorId === currentUser.id && <Crown className="w-4 h-4 text-yellow-400" />}
              </button>
            ))
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
