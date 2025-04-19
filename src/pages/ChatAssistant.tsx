
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Send, ThumbsUp, ThumbsDown, HelpCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  error?: boolean;
}

const ChatAssistant = () => {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiQuotaExceeded, setApiQuotaExceeded] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    // Create a unique ID for this message
    const messageId = crypto.randomUUID();
    
    // Add user message
    const userMessage: Message = {
      id: messageId,
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      // Call the Supabase edge function
      const { data, error } = await supabase.functions.invoke('study-assistant', {
        body: { message: input }
      });
      
      if (error) {
        console.error('Error calling study-assistant function:', error);
        throw new Error(error.message);
      }
      
      if (!data || !data.reply) {
        throw new Error('Invalid response from assistant');
      }
      
      // Check if API quota was exceeded
      if (data.error === "API_QUOTA_EXCEEDED") {
        setApiQuotaExceeded(true);
        toast.error("OpenAI API quota exceeded. Using fallback responses.", {
          duration: 5000,
        });
      }
      
      // Add assistant response
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        content: data.reply,
        sender: 'assistant',
        timestamp: new Date(),
        error: data.error ? true : false
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      toast.error(`Failed to get response: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Add error message from assistant
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        content: "I'm sorry, but I encountered an issue responding to your message. Please try again in a moment.",
        sender: 'assistant',
        timestamp: new Date(),
        error: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleFeedback = (messageId: string, type: 'up' | 'down') => {
    // This would typically send feedback to your backend
    toast.success(`${type === 'up' ? 'Positive' : 'Negative'} feedback recorded. Thank you!`);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b border-white/10 p-4 bg-card/50">
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
                <h1 className="font-semibold text-lg">Study Assistant</h1>
                <p className="text-xs text-muted-foreground">Powered by OpenAI</p>
              </div>
            </div>
          </div>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>Ask about:</p>
              <ul className="list-disc pl-4 mt-1 text-sm">
                <li>Study techniques</li>
                <li>Subject-specific questions</li>
                <li>Exam preparation</li>
                <li>Learning strategies</li>
              </ul>
            </TooltipContent>
          </Tooltip>
        </div>
      </header>
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="container mx-auto max-w-3xl space-y-6">
          {apiQuotaExceeded && (
            <Alert variant="warning" className="mb-4 bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                OpenAI API quota exceeded. You'll receive pre-written responses until this is resolved.
              </AlertDescription>
            </Alert>
          )}
          
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8 rounded-lg border border-white/10 bg-card/30 max-w-sm">
                <HelpCircle className="mx-auto h-12 w-12 text-primary/60 mb-4" />
                <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
                <p className="text-sm text-muted-foreground">
                  Ask any study-related question to get started with the AI assistant.
                </p>
              </div>
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`
                    flex gap-3 max-w-[85%]
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
                      rounded-xl px-4 py-3 text-base
                      ${message.sender === 'assistant' 
                        ? message.error
                          ? 'bg-amber-50/20 text-amber-700 border border-amber-200/30' 
                          : 'bg-primary/20 text-primary-foreground' 
                        : 'bg-secondary/20 text-secondary-foreground'
                      }
                    `}>
                      {message.content}
                      
                      {/* Feedback buttons only for assistant messages */}
                      {message.sender === 'assistant' && !message.error && (
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <button 
                            className="p-1 hover:text-primary transition-colors" 
                            onClick={() => handleFeedback(message.id, 'up')}
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </button>
                          <button 
                            className="p-1 hover:text-primary transition-colors"
                            onClick={() => handleFeedback(message.id, 'down')}
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </button>
                          <span className="text-[10px]">Feedback</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Typing indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex gap-3 max-w-[80%]">
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarFallback className="bg-primary/20 text-primary">AI</AvatarFallback>
                      <AvatarImage src="/placeholder.svg" className="p-1" />
                    </Avatar>
                    <div className="bg-primary/20 text-primary-foreground rounded-xl px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-current animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input Area */}
      <div className="border-t border-white/10 p-4 bg-card/50">
        <div className="container mx-auto max-w-3xl">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask your study assistant anything..."
              className="flex-1 bg-white/5 border-white/10 input-glow h-12"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage} 
              className="px-4 bg-gradient-to-r from-primary to-secondary hover:opacity-90 h-12"
              disabled={isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;
