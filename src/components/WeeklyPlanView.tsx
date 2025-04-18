
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Calendar, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { StudySession, WeeklyStudyPlan } from "@/types/studyPlan";
import { getWeeklyPlan, saveWeeklyPlan } from "@/utils/studyPlanStorage";

const WeeklyPlanView = () => {
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  
  useEffect(() => {
    const plan = getWeeklyPlan();
    if (plan && plan.sessions) {
      setStudySessions(plan.sessions);
    }
  }, []);
  
  const markAsComplete = (id: string) => {
    const updatedSessions = studySessions.map(session =>
      session.id === id ? { ...session, completed: true } : session
    );
    
    setStudySessions(updatedSessions);
    
    // Update storage
    const plan = getWeeklyPlan();
    if (plan) {
      plan.sessions = updatedSessions;
      saveWeeklyPlan(plan);
    }
    
    toast.success("Session marked as complete!");
  };

  const viewDetails = (id: string) => {
    const session = studySessions.find(s => s.id === id);
    if (session) {
      toast.info(`Viewing details for ${session.subject}: ${session.topic}`);
    }
  };

  if (studySessions.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg mb-2">No study sessions planned yet</h3>
        <p className="text-muted-foreground">Create your weekly study plan to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Day</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Topic</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {studySessions.map((session) => (
            <motion.tr
              key={session.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="border-b border-white/10"
            >
              <TableCell>{session.day}</TableCell>
              <TableCell className="font-medium">{session.subject}</TableCell>
              <TableCell>{session.topic}</TableCell>
              <TableCell>{session.time}</TableCell>
              <TableCell>{session.duration}</TableCell>
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
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => viewDetails(session.id)}
                  className="mr-2 h-8"
                >
                  Details
                </Button>
                {!session.completed && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => markAsComplete(session.id)}
                    className="h-8"
                  >
                    Mark Complete
                  </Button>
                )}
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default WeeklyPlanView;
