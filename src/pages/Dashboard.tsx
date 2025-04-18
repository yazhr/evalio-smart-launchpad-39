import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  LogOut, 
  MessageCircle, 
  Bot, 
  Calendar,
  CheckCircle 
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import WeeklyPlanView from "@/components/WeeklyPlanView";
import StudyPlanForm from "@/components/StudyPlanForm";
import { getWeeklyPlan, hasExistingPlan } from "@/utils/studyPlanStorage";
import { calculateCompletionRate } from "@/utils/studyPlanHelper";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  
  useEffect(() => {
    if (!hasExistingPlan()) {
      setShowPlanForm(true);
    }
  }, []);
  
  useEffect(() => {
    const updateProgress = () => {
      const completionRate = calculateCompletionRate();
      setProgressValue(completionRate);
    };
    
    updateProgress();
    
    const intervalId = setInterval(updateProgress, 60000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("You have been logged out");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Error signing out");
    }
  };
  
  const handlePlanComplete = () => {
    setShowPlanForm(false);
    const completionRate = calculateCompletionRate();
    setProgressValue(completionRate);
    toast.success("Study plan updated successfully!");
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-background p-6">
      <header className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-medium tracking-tight">StudySmart Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Your personalized learning experience</p>
          </div>
          
          <Card className="glass-card w-full md:w-auto">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10 border border-primary/20">
                  <AvatarImage src="" alt={user?.email || "User"} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user?.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user?.email}</p>
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => toast.info("Profile editing coming soon!")}>
                      <User className="mr-1 h-3 w-3" /> Profile
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs" onClick={handleSignOut}>
                      <LogOut className="mr-1 h-3 w-3" /> Sign Out
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass-card border border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-xl font-medium flex items-center">
                  <Bot className="mr-2 text-primary h-5 w-5" />
                  AI Study Assistant
                </CardTitle>
                <CardDescription className="text-sm mt-1">Get personalized study advice and plan recommendations</CardDescription>
              </div>
              <Link to="/chat">
                <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 px-4 py-2 text-sm">
                  <MessageCircle className="mr-2 h-4 w-4" /> Start Chat
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Your AI-powered study assistant can help with scheduling, learning strategies, and answering your subject questions.</p>
            </CardContent>
          </Card>
        </motion.div>
        
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
                onClick={() => setShowPlanForm(true)}
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
      </div>
      
      <Dialog open={showPlanForm} onOpenChange={setShowPlanForm}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          <StudyPlanForm onComplete={handlePlanComplete} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
