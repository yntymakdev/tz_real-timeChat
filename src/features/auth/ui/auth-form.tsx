"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
    <div className="w-screen h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <Card className="w-full max-w-md border shadow-lg bg-white dark:bg-slate-900 dark:border-slate-800">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <MessageSquare className="w-12 h-12 text-indigo-500" />
          </div>
          <CardTitle className="text-2xl font-semibold">Welcome to Chat</CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400">
            Enter your name to start real-time conversations
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
            <Input
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 text-base"
              autoFocus
              required
            />
            <Button type="submit" className="h-12 text-base bg-indigo-500 hover:bg-indigo-600 text-white">
              Start Chatting
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
