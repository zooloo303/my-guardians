import { useState } from "react";
import { CornerDownLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  placeholder: string;
  disabled?: boolean;
}

export default function ChatInput({ onSendMessage, placeholder, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col space-y-2"
    >
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={placeholder}
        className="min-h-[60px] resize-none"
        disabled={disabled}
      />
      <Button type="submit" className="self-end" disabled={disabled}>
        Send <CornerDownLeft className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );
}