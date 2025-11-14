"use client";
import { Button } from "@/components/ui/button";
import React from "react";

export function Header({ currentUser, activeChannel, onToggleSidebar, onToggleMembers }: any) {
  return (
    <header className="flex items-center justify-between p-3 border-b bg-white">
      <div className="flex items-center gap-3">
        <Button onClick={onToggleSidebar} className="p-2">
          Menu
        </Button>
        <div>
          <div className="font-bold">Real-time Chat</div>
          <div className="text-sm text-gray-500">
            {activeChannel ? `# ${activeChannel.name}` : "No channel selected"}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={onToggleMembers} className="p-2">
          Members
        </Button>
        <div className="text-sm text-gray-600">{currentUser.name}</div>
      </div>
    </header>
  );
}
