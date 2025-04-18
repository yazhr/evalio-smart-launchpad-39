
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, CheckCircle, Calendar, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { StudySession, WeeklyStudyPlan } from "@/types/studyPlan";
import { getWeeklyPlan, markSessionComplete } from "@/utils/studyPlanStorage";
import { checkAndResetWeeklyProgress } from "@/utils/studyPlanHelper";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

const WeeklyPlanView = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  const { data: plan, isLoading: isPlanLoading } = useQuery({
    queryKey: ['weeklyPlan', user?.id],
    queryFn: getWeeklyPlan,
    enabled: !!user,
    refetchOnWindowFocus: true,
    refetchInterval: 60000 // Refresh every minute
  });
  
  useEffect(() => {
    // Check if week has changed and reset progress if needed
    const checkWeekProgress = async () => {
      const wasReset = await checkAndResetWeeklyProgress();
      if (wasReset) {
        toast.info("A new week has started! Your progress has been reset.");
      }
    };
    
    checkWeekProgress();
  }, []);
  
  const handleMarkAsComplete = async (id: string) => {
    const success = await markSessionComplete(id);
    if (success) {
      toast.success("Session marked as complete!");
    } else {
      toast.error("Failed to mark session as complete. Please try again.");
    }
  };

  // Order sessions by day of week
  const orderByDay = (sessions: StudySession[]): StudySession[] => {
    const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return [...sessions].sort((a, b) => {
      return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
    });
  };

  if (isPlanLoading || isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!plan || !plan.sessions || plan.sessions.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-8 space-y-4"
      >
        <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-medium">No study sessions planned yet</h3>
        <p className="text-muted-foreground">Create your weekly study plan to get started</p>
      </motion.div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border border-white/10">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-medium">Day</TableHead>
            <TableHead className="font-medium">Subject</TableHead>
            <TableHead className="font-medium">Topic</TableHead>
            <TableHead className="font-medium">Time</TableHead>
            <TableHead className="font-medium">Status</TableHead>
            <TableHead className="text-right font-medium">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {orderByDay(plan.sessions).map((session) => (
              <motion.tr
                key={session.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="border-b border-white/10"
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{session.day}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{session.subject}</TableCell>
                <TableCell>{session.topic}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{session.time}</span>
                    <span className="text-xs text-muted-foreground">({session.duration})</span>
                  </div>
                </TableCell>
                <TableCell>
                  {session.completed ? (
                    <Badge variant="outline" className="bg-primary/20 text-primary">
                      <CheckCircle className="mr-1 h-3 w-3" /> Completed
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-secondary/20 text-secondary">
                      <Clock className="mr-1 h-3 w-3" /> Scheduled
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {!session.completed && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleMarkAsComplete(session.id)}
                      className="h-8 hover:bg-primary/20 hover:text-primary"
                    >
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Mark Complete
                    </Button>
                  )}
                </TableCell>
              </motion.tr>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
    </div>
  );
};

export default WeeklyPlanView;
