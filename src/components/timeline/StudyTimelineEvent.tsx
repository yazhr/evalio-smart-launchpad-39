
import { StudySession } from "@/types/studyPlan";
import { BookOpen, CheckCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StudyTimelineEventProps {
  session: StudySession;
}

export const StudyTimelineEvent = ({ session }: StudyTimelineEventProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "flex gap-4 p-4 rounded-lg transition-colors",
        session.completed
          ? "bg-primary/10"
          : "bg-muted/30 hover:bg-muted/50"
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background/50 backdrop-blur-sm">
        <BookOpen className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <p className="font-medium">{session.subject}</p>
          {session.completed && (
            <CheckCircle className="h-5 w-5 text-primary" />
          )}
        </div>
        <p className="text-sm text-muted-foreground">{session.topic}</p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>
            {session.time} ({session.duration})
          </span>
        </div>
      </div>
    </motion.div>
  );
};
