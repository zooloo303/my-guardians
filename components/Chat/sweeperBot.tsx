// components/Chat/sweeperBot.tsx
import { useState } from "react";
import ChatInput from "./chatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Message {
  sender: "user" | "bot";
  content: string;
}

function SweeperBot() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", content: "Hello Guardian! I'm SweeperBot. How can I assist you today?" }
  ]);

  const handleSendMessage = (message: string) => {
    setMessages(prev => [...prev, { sender: "user", content: message }]);
    // Here you would typically add logic to generate a bot response
    // For now, let's just add a placeholder response
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: "bot", content: "Beep boop! I'm processing your request." }]);
    }, 1000);
  };

  return (
    <Card className="w-[350px] h-[500px] flex flex-col">
      <CardHeader>
        <CardTitle>SweeperBot</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col p-0">
        <ScrollArea className="flex-grow p-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.sender === "user" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block p-2 rounded-lg ${
                  message.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </ScrollArea>
        <div className="p-4 pt-0">
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </CardContent>
    </Card>
  );
}

export default SweeperBot;