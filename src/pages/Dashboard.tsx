
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { Calendar, BookOpen, User, LogOut, MessageCircle, Bot } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import WeeklyPlanView from "@/components/WeeklyPlanView";
import StudyPlanForm from "@/components/StudyPlanForm";
import { getWeeklyPlan, hasExistingPlan } from "@/utils/studyPlanStorage";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  
  // Check if it's the first time and no plan exists
  useEffect(() => {
    if (!hasExistingPlan()) {
      setShowPlanForm(true);
    }
  }, []);
  
  // Calculate progress based on completed sessions
  useEffect(() => {
    const plan = getWeeklyPlan();
    if (plan && plan.sessions && plan.sessions.length > 0) {
      const completed = plan.sessions.filter(session => session.completed).length;
      const total = plan.sessions.length;
      setProgressValue(total > 0 ? (completed / total) * 100 : 0);
    }
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
  
  if (!user) {
    return null; // Don't render anything if not logged in
  }
  
  return (
    <>
      <div className="min-h-screen bg-background p-6">
        {/* Header with User Profile */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gradient bg-gradient-purple-blue">StudySmart Dashboard</h1>
              <p className="text-muted-foreground">Your personalized learning experience</p>
            </div>
            
            <Card className="glass-card w-full md:w-auto">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-primary/30">
                    <AvatarImage src="" alt={user.email || "User"} />
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {user.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.email}</p>
                    <div className="flex gap-2 mt-1">
                      <Button variant="outline" size="sm" className="h-8" onClick={() => toast.info("Profile editing coming soon!")}>
                        <User className="mr-1 h-4 w-4" /> Edit Profile
                      </Button>
                      <Button variant="outline" size="sm" className="h-8" onClick={handleSignOut}>
                        <LogOut className="mr-1 h-4 w-4" /> Log Out
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 gap-6">
          {/* Study Assistant Card */}
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="flex items-center">
                  <Bot className="mr-2 text-primary h-5 w-5" />
                  Talk to Your Study Assistant
                </CardTitle>
                <CardDescription>Get personalized study advice and plan recommendations</CardDescription>
              </div>
              <Link to="/chat">
                <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                  <MessageCircle className="mr-2 h-4 w-4" /> Start Chatting
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Your AI-powered study assistant can help with scheduling, learning strategies, and answering your subject questions.</p>
            </CardContent>
          </Card>
          
          {/* Progress Tracker */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 text-primary" />
                Weekly Progress
              </CardTitle>
              <CardDescription>Track your study plan completion for this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Completion Rate</span>
                  <span className="text-sm font-medium">{Math.round(progressValue)}%</span>
                </div>
                <Progress value={progressValue} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Weekly Plan */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 text-primary" />
                Weekly Study Plan
              </CardTitle>
              <CardDescription>Your scheduled study sessions for this week</CardDescription>
            </CardHeader>
            <CardContent>
              <WeeklyPlanView />
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowPlanForm(true)}
              >
                Edit Study Plan
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* First-time setup modal */}
      <Dialog open={showPlanForm} onOpenChange={setShowPlanForm}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <StudyPlanForm onComplete={() => setShowPlanForm(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Dashboard;
