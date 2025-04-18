
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Bell, Calendar, Clock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { getWeeklyPlan } from "@/utils/studyPlanStorage";
import { useAuth } from "@/hooks/useAuth";
import { StudySession } from "@/types/studyPlan";

export const SmartReminders = () => {
  const { user } = useAuth();
  const [remindersEnabled, setRemindersEnabled] = useState(() => {
    return localStorage.getItem("studysmart_reminders_enabled") === "true";
  });
  
  const { data: plan } = useQuery({
    queryKey: ['weeklyPlan', user?.id],
    queryFn: getWeeklyPlan,
    enabled: !!user,
  });
  
  useEffect(() => {
    localStorage.setItem("studysmart_reminders_enabled", remindersEnabled.toString());
    
    if (remindersEnabled) {
      // Request notification permission
      if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            toast.success("Notifications enabled for study reminders");
          }
        });
      }
    }
  }, [remindersEnabled]);
  
  useEffect(() => {
    if (!remindersEnabled || !plan?.sessions) return;
    
    // Clear existing reminders
    const existingTimers = localStorage.getItem("studysmart_reminder_timers");
    if (existingTimers) {
      const timers = JSON.parse(existingTimers);
      timers.forEach((timer: number) => clearTimeout(timer));
    }
    
    const newTimers: number[] = [];
    
    // Set up reminders for upcoming sessions
    plan.sessions.forEach(session => {
      if (session.completed) return;
      
      const [hour, minute] = session.time.split(':').map(Number);
      const reminderTime = new Date();
      reminderTime.setHours(hour, minute, 0, 0);
      reminderTime.setMinutes(reminderTime.getMinutes() - 30); // 30 minutes before
      
      // Get day of week
      const dayMapping: Record<string, number> = {
        "Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4,
        "Friday": 5, "Saturday": 6, "Sunday": 0
      };
      
      const targetDay = dayMapping[session.day];
      let daysUntilTarget = (targetDay - reminderTime.getDay() + 7) % 7;
      if (daysUntilTarget === 0 && reminderTime < new Date()) {
        daysUntilTarget = 7; // If today but time has passed, schedule for next week
      }
      
      reminderTime.setDate(reminderTime.getDate() + daysUntilTarget);
      
      const timeUntilReminder = reminderTime.getTime() - new Date().getTime();
      
      if (timeUntilReminder > 0) {
        const timerId = setTimeout(() => {
          if (Notification.permission === "granted") {
            new Notification("Study Reminder", {
              body: `Your ${session.subject} study session on ${session.topic} is in 30 minutes`,
              icon: "/favicon.ico"
            });
          }
          toast.info(`Reminder: ${session.subject} study session in 30 minutes`, {
            icon: <Clock className="h-4 w-4" />
          });
        }, timeUntilReminder);
        
        newTimers.push(timerId);
      }
    });
    
    localStorage.setItem("studysmart_reminder_timers", JSON.stringify(newTimers));
    
    // Clean up on unmount
    return () => {
      newTimers.forEach(timer => clearTimeout(timer));
    };
  }, [remindersEnabled, plan?.sessions]);
  
  // Get next session
  const getNextSession = (): StudySession | null => {
    if (!plan?.sessions) return null;
    
    const now = new Date();
    const today = now.toLocaleDateString('en-US', { weekday: 'long' });
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const dayMapping: Record<string, number> = {
      "Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4,
      "Friday": 5, "Saturday": 6, "Sunday": 0
    };
    
    // Get upcoming sessions (not completed)
    const upcomingSessions = plan.sessions
      .filter(session => !session.completed)
      .map(session => {
        const [hour, minute] = session.time.split(':').map(Number);
        const sessionTime = hour * 60 + minute;
        
        // Calculate days from now
        let daysFromNow = (dayMapping[session.day] - now.getDay() + 7) % 7;
        
        // If it's today but the time has passed, it should count as 7 days from now
        if (daysFromNow === 0 && sessionTime < currentTime) {
          daysFromNow = 7;
        }
        
        return {
          ...session,
          daysFromNow,
          minutesFromMidnight: sessionTime
        };
      })
      .sort((a, b) => {
        // Sort by days, then by time
        if (a.daysFromNow !== b.daysFromNow) {
          return a.daysFromNow - b.daysFromNow;
        }
        return a.minutesFromMidnight - b.minutesFromMidnight;
      });
    
    return upcomingSessions.length > 0 ? upcomingSessions[0] : null;
  };
  
  const nextSession = getNextSession();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 text-primary" />
              Smart Reminders
            </CardTitle>
            <CardDescription>Never miss a study session</CardDescription>
          </div>
          <Switch 
            checked={remindersEnabled}
            onCheckedChange={setRemindersEnabled}
            className="data-[state=checked]:bg-primary"
          />
        </CardHeader>
        <CardContent className="space-y-4">
          {remindersEnabled ? (
            <>
              <div className="p-3 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-1 flex items-center">
                  <Clock className="h-4 w-4 mr-1.5 text-primary" />
                  Next Study Session
                </h4>
                {nextSession ? (
                  <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-sm">
                    <div className="text-muted-foreground">Subject:</div>
                    <div className="font-medium">{nextSession.subject}</div>
                    <div className="text-muted-foreground">Topic:</div>
                    <div>{nextSession.topic}</div>
                    <div className="text-muted-foreground">When:</div>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {nextSession.day} at {nextSession.time}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No upcoming sessions scheduled.
                  </p>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                You'll receive a notification 30 minutes before each study session.
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Enable reminders to get notifications before your study sessions.
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
