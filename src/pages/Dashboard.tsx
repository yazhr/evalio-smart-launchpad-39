
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Clock, BookOpen, User, LogOut, ChevronRight, CheckCircle2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import StudyAssistant from "@/components/StudyAssistant";
import WeeklyPlanView from "@/components/WeeklyPlanView";
import UpcomingSession from "@/components/UpcomingSession";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [progressValue, setProgressValue] = useState(0);
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Simulate progress loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressValue(65);
    }, 500);
    return () => clearTimeout(timer);
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Tracker */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle2 className="mr-2 text-primary" />
                Progress Tracker
              </CardTitle>
              <CardDescription>Your weekly study goal completion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Weekly Progress</span>
                  <span className="text-sm font-medium">{progressValue}%</span>
                </div>
                <Progress value={progressValue} className="h-2" />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Detailed Progress Report
              </Button>
            </CardFooter>
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
          </Card>
        </div>

        <div className="space-y-6">
          {/* Upcoming Session */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 text-primary" />
                Upcoming Session
              </CardTitle>
              <CardDescription>Your next scheduled study session</CardDescription>
            </CardHeader>
            <CardContent>
              <UpcomingSession />
            </CardContent>
          </Card>

          {/* Study Assistant Chatbot */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="mr-2 text-primary" />
                Your Study Assistant
              </CardTitle>
              <CardDescription>Need help with your study plan? Ask me anything!</CardDescription>
            </CardHeader>
            <CardContent>
              <StudyAssistant />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
