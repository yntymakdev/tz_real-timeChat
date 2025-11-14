"use client";

import { useState } from "react";
import { User } from "@/shared/types";
import { Button } from "@/components/ui/button";
import { Menu, X, Users } from "lucide-react";
import { Sidebar } from "@/widgets/side-bar/sidebar";
import { ChatArea } from "@/widgets/chat-area/chat-area";
import { MembersPanel } from "@/widgets/members-panel/members-panel";

interface ChatLayoutProps {
  currentUser: User;
  channelsHook: any;
  messagesHook: any;
  onLogout: () => void;
}

export function ChatLayout({ currentUser, channelsHook, messagesHook, onLogout }: ChatLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [membersPanelOpen, setMembersPanelOpen] = useState(true);

  const {
    userChannels,
    activeChannel,
    activeChannelId,
    availableChannels,
    setActiveChannelId,
    createChannel,
    joinChannel,
    removeMember,
  } = channelsHook;

  const { messages, sendMessage } = messagesHook;

  const handleSendMessage = (text: string) => {
    if (!activeChannel || !currentUser) return;
    sendMessage(activeChannel.id, currentUser.id, currentUser.name, currentUser.avatar, text);
  };

  const channelMessages = activeChannelId ? messages[activeChannelId] || [] : [];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* MOBILE — Sidebar Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden bg-white shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
      </Button>

      {/* MOBILE — MembersPanel Toggle */}
      {activeChannel && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 right-4 z-50 lg:hidden bg-white shadow-lg"
          onClick={() => setMembersPanelOpen(!membersPanelOpen)}
        >
          <Users size={22} />
        </Button>
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed lg:static z-40 h-full bg-slate-900 text-white
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          w-64 border-r border-slate-800
        `}
      >
        <Sidebar
          currentUser={currentUser}
          channels={userChannels}
          activeChannelId={activeChannelId}
          availableChannels={availableChannels}
          onChannelSelect={(id) => {
            setActiveChannelId(id);
            setSidebarOpen(false);
          }}
          onCreateChannel={createChannel}
          onJoinChannel={joinChannel}
          onLogout={onLogout}
        />
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col bg-white">
        <ChatArea
          channel={activeChannel}
          messages={channelMessages}
          currentUser={currentUser}
          onSendMessage={handleSendMessage}
        />
      </div>

      {/* MEMBERS PANEL */}
      {activeChannel && (
        <div
          className={`
            fixed lg:static z-40 h-full bg-white border-l border-slate-200
            transition-transform duration-300
            w-72
            ${membersPanelOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
          `}
        >
          <MembersPanel
            channel={activeChannel}
            currentUser={currentUser}
            onRemoveMember={(userId) => removeMember(activeChannel.id, userId)}
          />
        </div>
      )}

      {/* MOBILE OVERLAY */}
      {(sidebarOpen || membersPanelOpen) && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => {
            setSidebarOpen(false);
            setMembersPanelOpen(false);
          }}
        />
      )}
    </div>
  );
}
