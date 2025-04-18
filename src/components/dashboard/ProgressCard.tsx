import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getWeeklyPlan } from "@/utils/studyPlanStorage";
import { useAuth } from "@/hooks/useAuth";

export const ProgressCard = () => {
  const { user } = useAuth();
  
  const { data: plan } = useQuery({
    queryKey: ['weeklyPlan', user?.id],
    queryFn: getWeeklyPlan,
    enabled: !!user,
    refetchOnWindowFocus: true,
  });
  
  const progressValue = plan?.sessions
    ? (plan.sessions.filter(session => session.completed).length / plan.sessions.length) * 100
    : 0;
  
  const getProgressColor = () => {
    if (progressValue < 25) return "#ea384c";  // Red for low progress
    if (progressValue < 50) return "#FEC6A1";  // Soft Orange for moderate progress
    if (progressValue < 75) return "#33C3F0";  // Sky Blue for good progress
    return "#9b87f5";  // Primary Purple for excellent progress
  };

  const progressVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="h-full"
    >
      <Card className="glass-card h-full relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
            opacity: [0.3, 0.15],
          }}
          transition={{
            duration: 15,
            ease: "linear",
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <CardHeader className="pb-2 relative">
          <motion.div
            variants={progressVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <CardTitle className="flex items-center text-lg">
                <CheckCircle className="mr-2 text-primary h-5 w-5" />
                Weekly Progress
              </CardTitle>
            </motion.div>
            <motion.div variants={itemVariants}>
              <CardDescription className="text-xs">Track your study plan completion</CardDescription>
            </motion.div>
          </motion.div>
        </CardHeader>
        <CardContent className="space-y-2 pt-2 relative">
          <motion.div
            variants={progressVariants}
            initial="hidden"
            animate="visible"
            className="space-y-2"
          >
            <motion.div variants={itemVariants} className="flex justify-between items-center">
              <span className="text-xs font-medium">Completion Rate</span>
              <span className="text-xs font-medium">{Math.round(progressValue)}%</span>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Progress 
                value={progressValue} 
                className="h-2" 
                indicatorClassName={`bg-[${getProgressColor()}]`}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <p className="text-xs text-muted-foreground">
                {progressValue === 0 
                  ? "Start your study plan!" 
                  : progressValue < 50 
                    ? "Progress is key. Keep going!" 
                    : progressValue < 100 
                      ? "Great progress!" 
                      : "Plan completed successfully!"}
              </p>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
