
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { motion } from "framer-motion";
import WeeklyPlanView from "@/components/WeeklyPlanView";
import { StudyTimeline } from "@/components/timeline/StudyTimeline";
import { getWeeklyPlan } from "@/utils/studyPlanStorage";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

interface StudyPlanCardProps {
  onEditPlan: () => void;
}

export const StudyPlanCard = ({ onEditPlan }: StudyPlanCardProps) => {
  const { user } = useAuth();

  const { data: plan, isLoading } = useQuery({
    queryKey: ['weeklyPlan', user?.id],
    queryFn: getWeeklyPlan,
    enabled: !!user,
    refetchOnWindowFocus: true,
    refetchInterval: 60000 // Refresh every minute
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 text-primary" />
              Weekly Study Plan
            </CardTitle>
            <CardDescription>Your scheduled study sessions for this week</CardDescription>
          </div>
          <Button 
            variant="outline" 
            onClick={onEditPlan}
            className="border-primary/30 hover:bg-primary/10"
          >
            Edit Plan
          </Button>
        </CardHeader>
        <CardContent>
          <WeeklyPlanView />
          {plan && plan.sessions && <StudyTimeline sessions={plan.sessions} />}
        </CardContent>
      </Card>
    </motion.div>
  );
};
