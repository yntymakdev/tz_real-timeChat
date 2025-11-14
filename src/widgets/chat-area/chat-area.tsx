"use client";

import { useEffect, useRef } from "react";
import { Channel, Message, User } from "@/shared/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageInput } from "@/features/send-messages/ui/message-input";
import { MessageSquare } from "lucide-react";
import { formatTime, getInitials } from "@/shared/lib/utils";

interface ChatAreaProps {
  channel: Channel | null;
  messages: Message[];
  currentUser: User;
  onSendMessage: (text: string) => void;
}

export function ChatArea({ channel, messages, currentUser, onSendMessage }: ChatAreaProps) {
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  if (!channel) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
        <MessageSquare size={40} className="mb-4" />
        <h2 className="text-2xl font-bold">Welcome to Chat</h2>
        <p>Select a channel or create one to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="px-4 py-2 border-b border-gray-200 shrink-0">
        <h2 className="text-lg font-semibold"># {channel.name}</h2>
        {channel.description && <p className="text-sm text-gray-500">{channel.description}</p>}
      </div>

      {/* !!! Messages scroll container !!! */}
      <div ref={messagesRef} className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            <p>No messages yet</p>
            <p>Be the first to say hello!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="flex items-start gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{getInitials(message.userName)}</AvatarFallback>
                <AvatarImage src={message.userAvatar} />
              </Avatar>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{message.userName}</span>
                  <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
                </div>
                <p>{message.text}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input (fixed height) */}
      <div className="border-t border-gray-200 shrink-0">
        <MessageInput onSend={onSendMessage} />
      </div>
    </div>
  );
}
