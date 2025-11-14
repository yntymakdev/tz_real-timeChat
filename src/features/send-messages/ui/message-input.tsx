"use client";

import { useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface MessageInputProps {
  onSend: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function MessageInput({ onSend, placeholder = "Type a message...", disabled = false }: MessageInputProps) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSend(text);
      setText("");
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Input
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyPress={handleKeyPress}
      placeholder={placeholder}
      disabled={disabled}
      className="flex-1"
    />
  );
}
