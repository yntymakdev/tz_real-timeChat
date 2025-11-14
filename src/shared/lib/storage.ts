// "@/shared/lib/storage.ts"
export const storage = {
  get: <T>(key: string): T | null => {
    if (typeof window === "undefined") return null;
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    if (typeof window === "undefined") return;
    try {
      const data = JSON.stringify(value);
      localStorage.setItem(key, data);

      // Trigger storage event for cross-tab sync
      window.dispatchEvent(
        new StorageEvent("storage", {
          key,
          newValue: data,
          url: window.location.href,
          storageArea: localStorage,
        })
      );
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  },

  remove: (key: string): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(key);
      window.dispatchEvent(
        new StorageEvent("storage", {
          key,
          newValue: null,
          url: window.location.href,
          storageArea: localStorage,
        })
      );
    } catch (error) {
      console.error(`Error removing from localStorage key "${key}":`, error);
    }
  },
};

export const STORAGE_KEYS = {
  USER: "chat_user",
  CHANNELS: "chat_channels",
  MESSAGES: "chat_messages",
  ONLINE_USERS: "chat_online_users",
} as const;
