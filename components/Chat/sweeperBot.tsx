import ChatInput from "./chatInput";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import OptimizationResult from "./optimizationResult"
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useState, useRef, useEffect } from "react";
import { useAuthContext } from "@/components/Auth/AuthContext";
import { optimizeArmor, ArmorOptimizationData } from "@/lib/api/armorApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Message {
  sender: "user" | "bot";
  content: string | React.ReactNode;
  isOptimizationRequest?: boolean;
}
interface SweeperBotProps {
  optimizationData: Omit<ArmorOptimizationData, 'username' | 'chatInput' | 'characterId'>;
}

function SweeperBot({ optimizationData }: SweeperBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", content: "This is not a combat zone, move along!" }
  ]);
  const [isOptimizationMode, setIsOptimizationMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { membershipId } = useAuthContext();
  const { characterId } = useParams();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  const handleSendMessage = async (message: string) => {
    setIsLoading(true);  // Set loading state to true at the start
  
    const newUserMessage: Message = { 
      sender: "user", 
      content: message,
      isOptimizationRequest: isOptimizationMode
    };
    setMessages(prev => [...prev, newUserMessage]);
  
    try {
      if (isOptimizationMode) {
        const fullOptimizationData: ArmorOptimizationData = {
          username: membershipId || "",
          chatInput: message,
          characterId: characterId as string,
          ...optimizationData
        };
        console.log("fullOptimizationData", fullOptimizationData);
        const response = await optimizeArmor(fullOptimizationData);
        setMessages(prev => [
          ...prev, 
          { sender: "bot", content: "Optimization complete! Here's the result:" },
          { sender: "bot", content: <OptimizationResult result={response} characterId={characterId as string}/> }
        ]);
      } else {
        // Handle general chat
        await new Promise(resolve => setTimeout(resolve, 1000));
        setMessages(prev => [...prev, { sender: "bot", content: "I'm a simple bot. For complex queries, please use the optimization mode." }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { sender: "bot", content: "Sorry, there was an error processing your request." }]);
    } finally {
      setIsLoading(false);  // Set loading state to false after all operations
      setIsOptimizationMode(false);
    }
  };

  const toggleOptimizationMode = () => {
    setIsOptimizationMode(!isOptimizationMode);
    if (!isOptimizationMode) {
      setMessages(prev => [...prev, { 
        sender: "bot", 
        content: "So, someone told you I deal in armor optimization? ... I see, I see, well ok then, describe your desired build, or help me pick up trash, your choice."
      }]);
    }
  };

  return (
    <Card className="max-w-xl mx-auto flex flex-col">
      <CardHeader className="flex-shrink-0 flex flex-row items-center justify-between">
        <CardTitle>SweeperBot</CardTitle>
        <Avatar>
          <AvatarImage src={"/sweeperBotAvatar.jpg"} alt={"sba"} />
          <AvatarFallback>SB</AvatarFallback>
        </Avatar>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col p-0 overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="flex-grow px-4 py-2">
          <div className="flex flex-col space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-2 rounded-lg ${
                    message.sender === "user" 
                      ? (message.isOptimizationRequest ? "bg-green-500 text-white" : "bg-blue-500 text-white")
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-black p-2 rounded-lg flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  SweeperBot is thinking...
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="flex-shrink-0 p-4 border-t">
          <div className="flex justify-between items-center mb-2">
            <Button 
              onClick={toggleOptimizationMode}
              variant={isOptimizationMode ? "default" : "outline"}
              disabled={isLoading}
            >
              {isOptimizationMode ? "Cancel Optimization" : "Optimize Armor"}
            </Button>
            {isOptimizationMode && (
              <span className="text-sm text-green-500">Optimization Mode Active</span>
            )}
          </div>
          <ChatInput 
            onSendMessage={handleSendMessage}
            placeholder={isOptimizationMode ? "Describe your desired build..." : "Prod SweeperBot..."}
            disabled={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default SweeperBot;