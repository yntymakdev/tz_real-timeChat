"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

interface CreateChannelDialogProps {
  onCreate: (name: string, description?: string) => void;
}

export function CreateChannelDialog({ onCreate }: CreateChannelDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = () => {
    if (!name.trim()) return;

    onCreate(name.trim(), description.trim() || undefined);

    setName("");
    setDescription("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Create Channel
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Channel</DialogTitle>
          <DialogDescription>Create a new channel for your team to communicate</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-slate-300">Channel Name</label>
          <Input placeholder="general" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
        </div>

        <div className="flex flex-col gap-1 mt-3">
          <label className="text-sm text-slate-300">Description (optional)</label>
          <Input
            placeholder="What's this channel about?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
