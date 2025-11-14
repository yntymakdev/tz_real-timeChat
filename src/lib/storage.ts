// English comments: small safe localStorage wrapper used across the app
export const storage = {
  get<T>(key: string): T | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  set<T>(key: string, value: T) {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(e);
    }
  },

  remove(key: string) {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(e);
    }
  },
};

export const KEYS = {
  USER: "chat_user",
  CHANNELS: "chat_channels",
  MESSAGES: "chat_messages",
} as const;
