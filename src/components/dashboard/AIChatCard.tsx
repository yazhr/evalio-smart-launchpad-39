
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export const AIChatCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-card border border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-xl font-medium flex items-center">
              <Bot className="mr-2 text-primary h-5 w-5" />
              AI Study Assistant
            </CardTitle>
            <CardDescription className="text-sm mt-1">
              Get personalized study advice and plan recommendations
            </CardDescription>
          </div>
          <Link to="/chat">
            <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 px-4 py-2 text-sm">
              <MessageCircle className="mr-2 h-4 w-4" /> Start Chat
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your AI-powered study assistant can help with scheduling, learning strategies, and answering your subject questions.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};
