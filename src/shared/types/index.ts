export interface User {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  online: boolean;
  lastSeen?: string;
  createdAt: string;
}

export interface Channel {
  id: string;
  name: string;
  description?: string;
  creatorId: string;
  members: User[];
  createdAt: string;
  isPrivate: boolean;
}

export interface Message {
  id: string;
  channelId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
  edited?: boolean;
  reactions?: Record<string, number>;
}

export type SyncEvent =
  | { type: "CHANNEL_CREATED"; channel: Channel }
  | { type: "CHANNEL_JOINED"; channelId: string; user: User }
  | { type: "CHANNEL_LEFT"; channelId: string; userId: string }
  | { type: "MEMBER_REMOVED"; channelId: string; userId: string }
  | { type: "MESSAGE_SENT"; message: Message }
  | { type: "USER_ONLINE"; userId: string }
  | { type: "USER_OFFLINE"; userId: string };
