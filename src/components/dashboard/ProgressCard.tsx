
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface ProgressCardProps {
  progressValue: number;
}

export const ProgressCard = ({ progressValue }: ProgressCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="glass-card">
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
