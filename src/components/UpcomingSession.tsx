
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Calendar, Clock, ChevronRight, Play } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const UpcomingSession = () => {
  // This would come from your backend in a real app
  const nextSession = {
    subject: "Physics",
    topic: "Quantum Mechanics",
    time: "Tuesday, 2:00 PM",
    duration: "2 hours",
  };

  const startSession = () => {
    toast.success("Starting your study session!");
    // In a real app, this would navigate to a study session page or start a timer
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <BookOpen className="text-primary" />
            {nextSession.subject}
          </div>
          <p className="text-muted-foreground">{nextSession.topic}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{nextSession.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{nextSession.duration}</span>
          </div>
        </div>

        <Button 
          className="w-full bg-gradient-purple-blue"
          onClick={startSession}
        >
          <Play className="mr-2 h-4 w-4" />
          Start Study Session
        </Button>
      </div>
    </motion.div>
  );
};

export default UpcomingSession;
