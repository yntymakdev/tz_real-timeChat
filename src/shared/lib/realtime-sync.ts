import { SyncEvent } from "@/shared/types";

class RealtimeSync {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<(event: SyncEvent) => void> = new Set();

  constructor() {
    if (typeof window !== "undefined") {
      try {
        this.channel = new BroadcastChannel("chat_sync");
        this.channel.onmessage = (event) => {
          this.notifyListeners(event.data);
        };
      } catch (error) {
        console.warn("BroadcastChannel not supported, using localStorage events");
      }

      window.addEventListener("storage", this.handleStorageChange);
    }
  }

  private handleStorageChange = (event: StorageEvent) => {
    if (event.key === "chat_sync_event" && event.newValue) {
      try {
        const syncEvent = JSON.parse(event.newValue) as SyncEvent;
        this.notifyListeners(syncEvent);
      } catch (error) {
        console.error("Error parsing sync event:", error);
      }
    }
  };

  private notifyListeners(event: SyncEvent) {
    this.listeners.forEach((listener) => listener(event));
  }

  subscribe(listener: (event: SyncEvent) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  broadcast(event: SyncEvent) {
    if (this.channel) {
      this.channel.postMessage(event);
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("chat_sync_event", JSON.stringify(event));
      setTimeout(() => localStorage.removeItem("chat_sync_event"), 100);
    }

    this.notifyListeners(event);
  }

  destroy() {
    if (this.channel) this.channel.close();
    if (typeof window !== "undefined") window.removeEventListener("storage", this.handleStorageChange);
    this.listeners.clear();
  }
}

export const realtimeSync = new RealtimeSync();
