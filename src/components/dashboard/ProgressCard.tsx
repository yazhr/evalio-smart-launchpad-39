
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getWeeklyPlan } from "@/utils/studyPlanStorage";
import { useAuth } from "@/hooks/useAuth";
import { calculateCompletionRate } from "@/utils/studyPlanHelper";

export const ProgressCard = () => {
  const { user } = useAuth();
  
  // Use React Query to fetch the study plan
  const { data: plan } = useQuery({
    queryKey: ['weeklyPlan', user?.id],
    queryFn: getWeeklyPlan,
    enabled: !!user,
    refetchOnWindowFocus: true,
  });
  
  // Calculate progress value dynamically based on current plan data
  const progressValue = plan?.sessions
    ? (plan.sessions.filter(session => session.completed).length / plan.sessions.length) * 100
    : 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="h-full"
    >
      <Card className="glass-card h-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="mr-2 text-primary" />
            Weekly Progress
          </CardTitle>
          <CardDescription>Track your study plan completion for this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Completion Rate</span>
              <span className="text-sm font-medium">{Math.round(progressValue)}%</span>
            </div>
            <Progress value={progressValue} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">
              {progressValue === 0 
                ? "You haven't completed any sessions yet. Let's get started!" 
                : progressValue < 50 
                  ? "You're making progress! Keep going to reach your goals." 
                  : progressValue < 100 
                    ? "Great progress! You're well on your way to completing your weekly plan." 
                    : "Excellent! You've completed all your planned study sessions this week."}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
