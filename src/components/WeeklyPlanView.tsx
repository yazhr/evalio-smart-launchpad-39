
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Calendar, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

// Example study data - in a real app, this would come from your backend
const studySessionsData = [
  {
    id: 1,
    day: "Monday",
    subject: "Mathematics",
    topic: "Linear Algebra",
    duration: "1 hour",
    completed: true,
    time: "9:00 AM"
  },
  {
    id: 2,
    day: "Tuesday",
    subject: "Physics",
    topic: "Quantum Mechanics",
    duration: "2 hours",
    completed: false,
    time: "2:00 PM"
  },
  {
    id: 3,
    day: "Wednesday",
    subject: "Computer Science",
    topic: "Data Structures",
    duration: "1.5 hours",
    completed: false,
    time: "10:30 AM"
  },
  {
    id: 4,
    day: "Thursday",
    subject: "Biology",
    topic: "Cell Biology",
    duration: "1 hour",
    completed: false,
    time: "3:00 PM"
  },
  {
    id: 5,
    day: "Friday",
    subject: "Chemistry",
    topic: "Organic Chemistry",
    duration: "1.5 hours",
    completed: false,
    time: "11:00 AM"
  }
];

const WeeklyPlanView = () => {
  const [studySessions, setStudySessions] = useState(studySessionsData);
  
  const markAsComplete = (id: number) => {
    setStudySessions(sessions =>
      sessions.map(session =>
        session.id === id ? { ...session, completed: true } : session
      )
    );
    toast.success("Session marked as complete!");
  };

  const viewDetails = (id: number) => {
    const session = studySessions.find(s => s.id === id);
    if (session) {
      toast.info(`Viewing details for ${session.subject}: ${session.topic}`);
    }
  };

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
