
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { motion } from "framer-motion";
import WeeklyPlanView from "@/components/WeeklyPlanView";

interface StudyPlanCardProps {
  onEditPlan: () => void;
}

export const StudyPlanCard = ({ onEditPlan }: StudyPlanCardProps) => {
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
        </CardContent>
      </Card>
    </motion.div>
  );
};
