"use client";

import { useState } from "react";
import { Channel, User } from "@/shared/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/shared/lib/utils";
import { Users, Search, Crown, UserX } from "lucide-react";

interface MembersPanelProps {
  channel: Channel | null;
  currentUser: User;
  onRemoveMember: (userId: string) => void;
}

export function MembersPanel({ channel, currentUser, onRemoveMember }: MembersPanelProps) {
  const [search, setSearch] = useState("");

  if (!channel) return null;

  const isCreator = channel.creatorId === currentUser.id;

  const filteredMembers = channel.members.filter((member) => member.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="bg-gray-50 border rounded-xl p-4 flex flex-col h-full">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <Users className="w-5 h-5" />
          Members
        </div>

        <Badge variant="outline">{channel.members.length}</Badge>
      </div>

      {/* SEARCH */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-white"
        />
      </div>

      {/* MEMBERS LIST */}
      <ScrollArea className="flex-1 rounded-md border bg-white p-2">
        {filteredMembers.length === 0 ? (
          <div className="text-center text-gray-500 py-6">No members found</div>
        ) : (
          filteredMembers.map((member) => (
            <div
              key={member.id}
              className="group flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={member.avatar ?? ""} alt={member.name} />
                  <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                </Avatar>

                <div>
                  <div className="flex items-center gap-2 font-medium">
                    {member.name}
                    {member.id === channel.creatorId && <Crown className="w-4 h-4 text-yellow-500" />}
                  </div>

                  <div className={`text-sm ${member.online ? "text-green-600" : "text-gray-500"}`}>
                    {member.online ? "Online" : "Offline"}
                  </div>
                </div>
              </div>

              {/* REMOVE BUTTON — только создатель и нельзя удалить себя */}
              {isCreator && member.id !== currentUser.id && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveMember(member.id)}
                  className="opacity-0 group-hover:opacity-100 transition"
                >
                  <UserX className="w-5 h-5 text-red-500" />
                </Button>
              )}
            </div>
          ))
        )}
      </ScrollArea>
    </div>
  );
}
