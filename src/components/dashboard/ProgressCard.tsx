
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getWeeklyPlan } from "@/utils/studyPlanStorage";
import { useAuth } from "@/hooks/useAuth";

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
  
  // Determine progress color based on completion rate
  const getProgressColor = () => {
    if (progressValue < 25) return "#ea384c";  // Red for low progress
    if (progressValue < 50) return "#FEC6A1";  // Soft Orange for moderate progress
    if (progressValue < 75) return "#33C3F0";  // Sky Blue for good progress
    return "#9b87f5";  // Primary Purple for excellent progress
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="h-full"
    >
      <Card className="glass-card h-full">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-lg">
            <CheckCircle className="mr-2 text-primary h-5 w-5" />
            Weekly Progress
          </CardTitle>
          <CardDescription className="text-xs">Track your study plan completion</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 pt-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium">Completion Rate</span>
            <span className="text-xs font-medium">{Math.round(progressValue)}%</span>
          </div>
          <Progress 
            value={progressValue} 
            className="h-2" 
            indicatorClassName={`bg-[${getProgressColor()}]`}
          />
          <p className="text-xs text-muted-foreground">
            {progressValue === 0 
              ? "Start your study plan!" 
              : progressValue < 50 
                ? "Progress is key. Keep going!" 
                : progressValue < 100 
                  ? "Great progress!" 
                  : "Plan completed successfully!"}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};
