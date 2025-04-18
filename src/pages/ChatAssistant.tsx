
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Send, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

const ChatAssistant = () => {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: `Hi ${user?.email?.split('@')[0] || 'there'}! I'm your AI Study Assistant. How can I help with your studies today?`,
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b border-white/10 p-4">
        <div className="container mx-auto max-w-4xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 bg-primary/20 border border-primary/40">
                <AvatarFallback className="bg-primary/20 text-primary">AI</AvatarFallback>
                <AvatarImage src="/placeholder.svg" />
              </Avatar>
              <div>
                <h1 className="font-semibold text-lg">Your Study Assistant</h1>
                <p className="text-xs text-muted-foreground">Always here to help you study smarter</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="container mx-auto max-w-3xl space-y-6">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`
                  flex gap-3 max-w-[80%]
                  ${message.sender === 'user' ? 'flex-row-reverse' : ''}
                `}>
                  <Avatar className="h-8 w-8 mt-1">
                    {message.sender === 'assistant' ? (
                      <>
                        <AvatarFallback className="bg-primary/20 text-primary">AI</AvatarFallback>
                        <AvatarImage src="/placeholder.svg" className="p-1" />
                      </>
                    ) : (
                      <>
                        <AvatarFallback className="bg-secondary/20 text-secondary">
                          {user?.email?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  <div className={`
                    rounded-xl px-4 py-2 text-sm
                    ${message.sender === 'assistant' 
                      ? 'bg-primary/20 text-primary-foreground' 
                      : 'bg-secondary/20 text-secondary-foreground'
                    }
                  `}>
                    {message.content}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input Area */}
      <div className="border-t border-white/10 p-4">
        <div className="container mx-auto max-w-3xl">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask your study assistant anything..."
              className="flex-1 bg-white/5 border-white/10 input-glow"
            />
            <Button onClick={handleSend} className="px-4">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;
