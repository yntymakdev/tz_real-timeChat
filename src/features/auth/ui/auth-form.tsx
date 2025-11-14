"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

interface AuthFormProps {
  onAuth: (name: string) => void;
}

export function AuthForm({ onAuth }: AuthFormProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAuth(name.trim());
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-slate-950 text-white">
      <Card className="w-full max-w-md bg-slate-900 border-slate-800">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-3">
            <MessageSquare className="w-10 h-10 text-indigo-400" />
          </div>
          <CardTitle className="text-xl">Welcome to Chat</CardTitle>
          <CardDescription className="text-slate-400">Enter your name to start real-time conversations</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
            <Input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 text-base"
              autoFocus
              required
            />

            <Button type="submit" className="h-12 text-base">
              Start Chatting
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
