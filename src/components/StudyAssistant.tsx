
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

// Example responses for the assistant
const assistantResponses = [
  "Based on your study habits, I recommend taking a 5-minute break every 25 minutes to maximize retention.",
  "For your upcoming Physics exam, focus on reviewing quantum mechanics concepts as they align with your test topics.",
  "I've noticed you've been studying consistently this week - great job keeping up with your schedule!",
  "Would you like me to create a quick quiz to test your knowledge on Linear Algebra before tomorrow's session?",
  "Remember to review your notes from yesterday's session on Data Structures to reinforce your learning.",
  "I've updated your study plan based on your recent progress. You're making excellent headway in Biology!"
];

const StudyAssistant = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hi! I'm your AI study assistant. How can I help with your studies today?",
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    
    // Simulate AI response (with typing effect)
    setTimeout(() => {
      const randomResponse = assistantResponses[Math.floor(Math.random() * assistantResponses.length)];
      const assistantMessage: Message = {
        id: messages.length + 2,
        content: randomResponse,
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[400px]">
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 mb-4">
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`
              flex gap-2 max-w-[80%]
              ${message.sender === 'user' ? 'flex-row-reverse' : ''}
            `}>
              <Avatar className="h-6 w-6">
                {message.sender === 'assistant' ? (
                  <>
                    <AvatarImage src="/placeholder.svg" className="bg-primary/10" />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">AI</AvatarFallback>
                  </>
                ) : (
                  <>
                    <AvatarFallback className="bg-secondary/10 text-secondary text-xs">U</AvatarFallback>
                  </>
                )}
              </Avatar>
              <div className={`
                rounded-lg px-3 py-2 text-sm
                ${message.sender === 'assistant' 
                  ? 'bg-primary/10 text-primary-foreground' 
                  : 'bg-secondary/10 text-secondary-foreground'
                }
              `}>
                {message.content}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask for study tips or questions about your topics..."
          className="bg-white/5 border-white/10 text-sm"
        />
        <Button onClick={handleSend} variant="outline" size="icon" className="shrink-0">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default StudyAssistant;
