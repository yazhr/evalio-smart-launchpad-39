
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

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
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setHasError(false);
    
    try {
      console.log('Sending to study-assistant function:', input);
      
      // Call the edge function
      const { data, error } = await supabase.functions.invoke('study-assistant', {
        body: { message: input }
      });

      console.log('Function response:', data);

      if (error) {
        console.error('Function error:', error);
        throw new Error(`Edge function error: ${error.message}`);
      }
      
      if (!data || !data.reply) {
        console.error('Invalid response format from function:', data);
        throw new Error('Received an invalid response from the assistant');
      }

      const assistantMessage: Message = {
        id: messages.length + 2,
        content: data.reply,
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Error in handleSend:', error);
      toast.error(`Sorry, I couldn't process your request: ${error.message}`);
      setHasError(true);
      
      // Add error message to the chat
      const errorMessage: Message = {
        id: messages.length + 2,
        content: "I apologize, but I'm having trouble connecting to my knowledge base right now. Please try again in a moment.",
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[400px]">
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 mb-4">
        {hasError && (
          <Alert variant="destructive" className="mb-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              There was an issue connecting to the AI service. Please try again later.
            </AlertDescription>
          </Alert>
        )}
        
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
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src="/placeholder.svg" className="bg-primary/10" />
                <AvatarFallback className="bg-primary/10 text-primary text-xs">AI</AvatarFallback>
              </Avatar>
              <div className="bg-primary/10 rounded-lg px-3 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask for study tips or questions about your topics..."
          className="bg-white/5 border-white/10 text-sm"
          disabled={isLoading}
        />
        <Button 
          onClick={handleSend} 
          variant="outline" 
          size="icon" 
          className={`shrink-0 ${isLoading ? 'opacity-50' : ''}`}
          disabled={isLoading}
        >
          <Send className={`h-4 w-4 ${isLoading ? 'animate-pulse' : ''}`} />
        </Button>
      </div>
    </div>
  );
};

export default StudyAssistant;
