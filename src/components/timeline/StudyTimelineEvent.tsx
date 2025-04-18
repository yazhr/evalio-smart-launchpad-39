
import { StudySession } from "@/types/studyPlan";
import { BookOpen, CheckCircle, Clock, CalendarClock } from "lucide-react";
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
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex gap-4 p-4 rounded-lg border border-border/20 backdrop-blur-sm transition-all duration-300",
        session.completed
          ? "bg-primary/10 shadow-lg shadow-primary/5"
          : "bg-muted/30 hover:bg-muted/50 hover:border-border/30"
      )}
    >
      <div className="relative">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-background/50 backdrop-blur-sm border border-border/20">
          <BookOpen className="h-5 w-5 text-primary" />
        </div>
        {!session.completed && (
          <div className="absolute -bottom-8 left-1/2 w-px h-8 bg-gradient-to-b from-border/50 to-transparent" />
        )}
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className="font-semibold text-base">{session.subject}</h4>
            <p className="text-sm text-muted-foreground mt-0.5">{session.topic}</p>
          </div>
          {session.completed ? (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="bg-primary/20 text-primary rounded-full p-1"
            >
              <CheckCircle className="h-5 w-5" />
            </motion.div>
          ) : (
            <CalendarClock className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background/50 px-3 py-1.5 rounded-md w-fit">
          <Clock className="h-4 w-4" />
          <span>{session.time}</span>
          <span className="text-primary/50">•</span>
          <span>{session.duration}</span>
        </div>
      </div>
    </motion.div>
  );
};
