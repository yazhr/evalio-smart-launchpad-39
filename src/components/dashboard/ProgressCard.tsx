import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Book, Clock } from "lucide-react";
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

  const floatingAnimation = {
    y: [-5, 5],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  };

  const circleAnimation = {
    scale: [0.97, 1.03],
    opacity: [0.7, 0.9],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
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
            className="space-y-4"
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

            <div className="flex justify-center items-center h-32 relative mt-4">
              <motion.div
                className="absolute w-32 h-32 rounded-full bg-primary/5"
                animate={circleAnimation}
              />
              <motion.div className="relative z-10 flex flex-col items-center gap-2">
                <motion.div animate={floatingAnimation}>
                  <Book className="w-12 h-12 text-primary" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-2"
                >
                  <Clock className="w-4 h-4 text-primary/70" />
                  <span className="text-sm text-muted-foreground">Study Time</span>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
