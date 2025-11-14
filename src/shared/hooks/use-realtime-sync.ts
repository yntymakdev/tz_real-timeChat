import { useEffect } from "react";
import { SyncEvent } from "@/shared/types";
import { realtimeSync } from "../lib/realtime-sync";

export function useRealtimeSync(callback: (event: SyncEvent) => void) {
  useEffect(() => {
    const unsubscribe = realtimeSync.subscribe(callback);

    return () => {
      unsubscribe();
    };
  }, [callback]);
}
