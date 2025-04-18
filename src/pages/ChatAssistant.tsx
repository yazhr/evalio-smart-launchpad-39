
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Send, Bot, User, ThumbsUp, ThumbsDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getWeeklyPlan } from "@/utils/studyPlanStorage";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

// Example tailored responses for the AI assistant
const getAssistantResponse = (userInput: string, userName: string) => {
  // Get user's study plan to provide personalized responses
  const plan = getWeeklyPlan();
  const subjects = plan?.subjects || [];
  const subjectNames = subjects.map(s => s.name.toLowerCase());
  
  // Check if user message mentions any of their subjects
  const mentionedSubject = subjectNames.find(subject => 
    userInput.toLowerCase().includes(subject)
  );

  // Check for common question patterns
  if (userInput.toLowerCase().includes("help") && userInput.toLowerCase().includes("study")) {
    return `${userName}, based on your study habits, I recommend using the Pomodoro technique: 25 minutes of focused study followed by a 5-minute break. Would you like me to explain more about effective study methods?`;
  } else if (userInput.toLowerCase().includes("progress")) {
    const progressResponse = plan ? 
      `You've made good progress on your weekly plan, ${userName}. Would you like me to suggest areas to focus on next?` :
      `I don't see a study plan set up yet, ${userName}. Would you like to create one so I can track your progress?`;
    return progressResponse;
  } else if (userInput.toLowerCase().includes("tired") || userInput.toLowerCase().includes("stressed")) {
    return `I understand studying can be draining, ${userName}. Taking regular breaks is important. Consider a 15-minute walk or some stretching exercises to refresh your mind. Remember, consistency beats intensity in the long run.`;
  } else if (mentionedSubject) {
    // Find the specific subject and its topics
    const subject = subjects.find(s => s.name.toLowerCase() === mentionedSubject);
    if (subject && subject.topics.length > 0) {
      const topicsList = subject.topics.map(t => t.name).join(", ");
      return `For ${subject.name}, we've planned to cover: ${topicsList}. Which specific topic would you like help with?`;
    }
    return `I see you're asking about ${mentionedSubject}. What specific aspect would you like help with?`;
  } else if (userInput.toLowerCase().includes("quiz") || userInput.toLowerCase().includes("test")) {
    return `I'd be happy to help you prepare for your quiz. Based on your study plan, what subject is the quiz for? I can create practice questions tailored to your topics.`;
  } else {
    // Default smart responses
    const responses = [
      `I'm analyzing your study patterns, ${userName}. You seem to be most productive in the mornings. Would you like me to adjust your plan to focus difficult topics during that time?`,
      `Based on your consistent work in your study plan, I recommend focusing on connecting concepts across subjects. Would you like some interdisciplinary exercises?`,
      `${userName}, I notice you haven't marked any physics sessions as complete this week. Do you need some extra help with those topics?`,
      `I see you've been studying regularly. Great work! Would you like me to create a quick quiz based on your recent topics to test your retention?`,
      `Would you like some memory techniques specifically tailored to the topics in your study plan?`,
      `Based on your recent progress, I think you're ready to tackle some more advanced problems in your core subjects. Should I suggest some?`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
};

const ChatAssistant = () => {
  const { user } = useAuth();
  const userName = user?.email?.split('@')[0] || 'there';
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: `Hi ${userName}! I'm your AI Study Assistant. How can I help with your studies today?`,
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  
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
    
    // Show typing indicator
    setIsTyping(true);
    
    // Simulate AI response (with typing effect)
    setTimeout(() => {
      setIsTyping(false);
      
      const assistantResponse = getAssistantResponse(userMessage.content, userName);
      const assistantMessage: Message = {
        id: messages.length + 2,
        content: assistantResponse,
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    }, 1500); // Simulated typing time
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
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
                <h1 className="font-semibold text-lg">Your Study Assistant</h1>
                <p className="text-xs text-muted-foreground">Always here to help you study smarter</p>
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
              <p>Ask your AI assistant about:</p>
              <ul className="list-disc pl-4 mt-1 text-sm">
                <li>Study tips for specific subjects</li>
                <li>Help with your weekly plan</li>
                <li>Exam preparation strategies</li>
                <li>Learning techniques</li>
              </ul>
            </TooltipContent>
          </Tooltip>
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
                      ? 'bg-primary/20 text-primary-foreground' 
                      : 'bg-secondary/20 text-secondary-foreground'
                    }
                  `}>
                    {message.content}
                    
                    {/* Feedback buttons only for assistant messages */}
                    {message.sender === 'assistant' && message.id !== 1 && (
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <button className="p-1 hover:text-primary transition-colors">
                          <ThumbsUp className="h-3 w-3" />
                        </button>
                        <button className="p-1 hover:text-primary transition-colors">
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
            {isTyping && (
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
            />
            <Button onClick={handleSend} className="px-4 bg-gradient-to-r from-primary to-secondary hover:opacity-90 h-12">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-xs text-muted-foreground mt-2 px-2">
            Try asking about study techniques, scheduling help, or specific subjects in your plan
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;
