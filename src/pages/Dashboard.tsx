
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import StudyPlanForm from "@/components/StudyPlanForm";
import { hasExistingPlan } from "@/utils/studyPlanStorage";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AIChatCard } from "@/components/dashboard/AIChatCard";
import { ProgressCard } from "@/components/dashboard/ProgressCard";
import { StudyPlanCard } from "@/components/dashboard/StudyPlanCard";
import { StreakTracker } from "@/components/dashboard/StreakTracker";
import { SmartReminders } from "@/components/dashboard/SmartReminders";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";

const Dashboard = () => {
  const [showPlanForm, setShowPlanForm] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const checkExistingPlan = async () => {
      if (user && !(await hasExistingPlan())) {
        setShowPlanForm(true);
      }
    };
    
    checkExistingPlan();
  }, [user]);
  
  const handlePlanComplete = async () => {
    setShowPlanForm(false);
    // Refresh the study plan data
    queryClient.invalidateQueries({ queryKey: ['weeklyPlan'] });
    toast.success("Study plan updated successfully!");
  };
  
  return (
    <div className="min-h-screen bg-background p-6">
      <DashboardHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="h-full">
          <ProgressCard />
        </div>
        <div className="grid grid-cols-1 gap-4 h-full">
          <StreakTracker />
          <SmartReminders />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <StudyPlanCard onEditPlan={() => setShowPlanForm(true)} />
        <AIChatCard />
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
