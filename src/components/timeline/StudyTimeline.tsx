
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useQuoteOfTheDay } from "@/hooks/useQuoteOfTheDay";
import { StudyTimelineEvent } from "./StudyTimelineEvent";
import { StudySession } from "@/types/studyPlan";
import { Clock } from "lucide-react";

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
    <Card className="mt-6">
      <CardHeader className="space-y-4 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <blockquote className="text-lg italic text-muted-foreground border-l-4 border-primary/20 pl-4">
            "{quote}"
          </blockquote>
          <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg">
            <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p>{tip}</p>
          </div>
        </motion.div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-8">
          {Object.entries(groupedSessions).map(([day, daySessions], index) => (
            <div key={day} className="relative">
              {index !== 0 && (
                <Separator className="absolute -top-4 left-0 right-0" />
              )}
              <h3 className="font-semibold text-lg mb-4">{day}</h3>
              <div className="space-y-4">
                {daySessions.map((session) => (
                  <StudyTimelineEvent key={session.id} session={session} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
