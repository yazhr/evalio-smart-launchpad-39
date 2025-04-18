
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Flame, Award, Calendar, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { StreakData } from "@/types/studyPlan";

export const StreakTracker = () => {
  const { user } = useAuth();
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastUpdated: new Date().toISOString(),
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const getStreakData = async () => {
      if (!user) return;
      
      // First, try to get data from localStorage
      const localData = localStorage.getItem('studysmart_streak');
      
      if (localData) {
        const parsedData = JSON.parse(localData);
        setStreakData(parsedData);
      }
      
      try {
        // Then check if we need to update based on completed sessions
        const today = new Date().toISOString().split('T')[0];
        const lastUpdated = streakData.lastUpdated.split('T')[0];
        
        if (today === lastUpdated) {
          setLoading(false);
          return;
        }
        
        // Check if user completed any sessions yesterday
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toDateString();
        
        const { data: sessions } = await supabase
          .from('study_sessions')
          .select('*')
          .eq('user_id', user.id)
          .eq('completed', true);
          
        const hasCompletedYesterday = sessions?.some(session => 
          new Date(session.updated_at).toDateString() === yesterdayString
        );
        
        let newStreak = { ...streakData };
        
        if (hasCompletedYesterday) {
          // Increment streak
          newStreak.currentStreak += 1;
          
          // Update longest streak if needed
          if (newStreak.currentStreak > newStreak.longestStreak) {
            newStreak.longestStreak = newStreak.currentStreak;
          }
        } else {
          // Break the streak
          newStreak.currentStreak = 0;
        }
        
        newStreak.lastUpdated = today;
        setStreakData(newStreak);
        localStorage.setItem('studysmart_streak', JSON.stringify(newStreak));
        
      } catch (error) {
        console.error("Error checking streak:", error);
      } finally {
        setLoading(false);
      }
    };
    
    getStreakData();
  }, [user, streakData.lastUpdated]);
  
  // Determine badge to show based on streak
  const getBadge = () => {
    if (streakData.currentStreak >= 30) return { icon: <Award className="h-4 w-4" />, text: "Master" };
    if (streakData.currentStreak >= 14) return { icon: <Star className="h-4 w-4" />, text: "Champion" };
    if (streakData.currentStreak >= 7) return { icon: <Calendar className="h-4 w-4" />, text: "Consistent" };
    return { icon: <Flame className="h-4 w-4" />, text: "Getting Started" };
  };
  
  const badge = getBadge();
  
  // Calculate progress to next badge
  const getNextBadgeProgress = () => {
    if (streakData.currentStreak >= 30) return 100; // Already at max badge
    if (streakData.currentStreak >= 14) return (streakData.currentStreak - 14) / (30 - 14) * 100; // Progress to Master
    if (streakData.currentStreak >= 7) return (streakData.currentStreak - 7) / (14 - 7) * 100; // Progress to Champion
    return streakData.currentStreak / 7 * 100; // Progress to Consistent
  };
  
  if (loading) {
    return (
      <Card className="glass-card">
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="glass-card overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center">
            <Flame className="mr-2 text-primary" /> 
            Streak Tracker
          </CardTitle>
          <CardDescription>Keep your learning momentum</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Current Streak</p>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold mr-2">{streakData.currentStreak}</span>
                <span className="text-sm text-muted-foreground">days</span>
              </div>
            </div>
            <Badge className="px-3 py-1.5 bg-gradient-to-r from-primary/80 to-primary text-white">
              {badge.icon}
              <span className="ml-1">{badge.text}</span>
            </Badge>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span>Progress to next badge</span>
              <span>{Math.round(getNextBadgeProgress())}%</span>
            </div>
            <Progress value={getNextBadgeProgress()} className="h-2" />
          </div>
          
          <div className="pt-2 flex justify-between items-center">
            <div className="flex items-center">
              <Award className="h-4 w-4 text-muted-foreground mr-1.5" />
              <span className="text-sm text-muted-foreground">Longest Streak: {streakData.longestStreak} days</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
