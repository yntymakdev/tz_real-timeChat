"use client";

import { ChatLayout } from "./chat-layout";
import { AuthForm } from "@/features/auth/ui/auth-form";
import { useUser } from "@/entities/user/model/use-user";
import { useMessages } from "@/entities/message/model/use-messages";
import { useChannels } from "@/entities/channel/model/use-channel";

export function ChatApplication() {
  const { currentUser, createUser, logout } = useUser();

  const channelsHook = useChannels(currentUser);
  const messagesHook = useMessages();

  if (!currentUser) {
    return <AuthForm onAuth={(name) => createUser(name)} />;
  }

  return (
    <ChatLayout currentUser={currentUser} channelsHook={channelsHook} messagesHook={messagesHook} onLogout={logout} />
  );
}
