"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Channel } from "@/shared/types";
import { Users, Search } from "lucide-react";

interface JoinChannelDialogProps {
  channels?: Channel[];
  currentUserId?: string;
  onJoin: (channelId: string) => void | Promise<void>;
}

export function JoinChannelDialog({ channels = [], currentUserId, onJoin }: JoinChannelDialogProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loadingJoin, setLoadingJoin] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return channels;
    return channels.filter((ch) => ch.name.toLowerCase().includes(q));
  }, [channels, search]);

  const handleJoin = async (channelId: string) => {
    try {
      setLoadingJoin(channelId);
      await Promise.resolve(onJoin(channelId));
      setOpen(false);
      setSearch("");
    } catch (err) {
      console.error("Join error:", err);
    } finally {
      setLoadingJoin(null);
    }
  };

  useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="w-full">
          <Users className="w-4 h-4 mr-2" />
          Join Channel
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Join a Channel</DialogTitle>
          <DialogDescription>
            Browse available channels and join any. Private channels won't be joinable.
          </DialogDescription>
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
          <Input
            placeholder="Search channels..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
            autoFocus
          />
        </div>

        <ScrollArea className="max-h-80">
          {filtered.length === 0 ? (
            <div className="py-6 text-center text-sm text-slate-400">No channels found</div>
          ) : (
            <div className="flex flex-col gap-3 p-1">
              {filtered.map((channel) => {
                const members = channel.members ?? [];
                const isMember = currentUserId ? members.some((m) => m.id === currentUserId) : false;

                return (
                  <div
                    key={channel.id}
                    className="p-3 rounded-lg border bg-white/5 border-slate-200 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold"># {channel.name}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Users className="w-4 h-4" />
                        <span>{members.length}</span>
                      </div>
                    </div>

                    {channel.description && <p className="text-sm text-slate-500">{channel.description}</p>}

                    <div className="flex items-center gap-2 mt-2">
                      {channel.isPrivate ? (
                        <span className="text-xs text-amber-600">Private — cannot join</span>
                      ) : isMember ? (
                        <Button size="sm" disabled variant="outline">
                          Joined
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => handleJoin(channel.id)} disabled={loadingJoin !== null}>
                          {loadingJoin === channel.id ? "Joining..." : "Join"}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="mt-4">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
