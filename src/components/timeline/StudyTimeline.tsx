
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useQuoteOfTheDay } from "@/hooks/useQuoteOfTheDay";
import { StudyTimelineEvent } from "./StudyTimelineEvent";
import { StudySession } from "@/types/studyPlan";
import { Clock, Quote, BookMarked } from "lucide-react";

interface StudyTimelineProps {
  sessions: StudySession[];
}

export const StudyTimeline = ({ sessions }: StudyTimelineProps) => {
  const { quote, tip } = useQuoteOfTheDay();

  // Group sessions by day
  const groupedSessions = sessions.reduce((acc, session) => {
    if (!acc[session.day]) {
      acc[session.day] = [];
    }
    acc[session.day].push(session);
    return acc;
  }, {} as Record<string, StudySession[]>);

  return (
    <Card className="mt-6 border-none bg-gradient-to-b from-background/80 to-muted/20">
      <CardHeader className="space-y-6 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="relative overflow-hidden rounded-xl border border-border/20 bg-muted/30 p-6 backdrop-blur-sm">
            <Quote className="absolute right-4 top-4 h-16 w-16 rotate-6 text-primary/10" />
            <blockquote className="relative text-lg italic text-foreground">
              "{quote}"
            </blockquote>
          </div>
          <div className="flex items-start gap-4 rounded-lg border border-border/20 bg-muted/30 p-4 backdrop-blur-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <BookMarked className="h-5 w-5 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{tip}</p>
          </div>
        </motion.div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="relative space-y-8">
          {Object.entries(groupedSessions).map(([day, daySessions], index) => (
            <motion.div
              key={day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {index !== 0 && (
                <Separator className="absolute -top-4 left-0 right-0" />
              )}
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Clock className="h-4 w-4" />
                </div>
                <h3 className="font-semibold text-lg">{day}</h3>
              </div>
              <div className="relative space-y-6">
                {daySessions.map((session) => (
                  <StudyTimelineEvent key={session.id} session={session} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
