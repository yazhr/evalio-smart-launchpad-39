
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import StudyPlanForm from "@/components/StudyPlanForm";
import { hasExistingPlan } from "@/utils/studyPlanStorage";
import { calculateCompletionRate } from "@/utils/studyPlanHelper";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AIChatCard } from "@/components/dashboard/AIChatCard";
import { ProgressCard } from "@/components/dashboard/ProgressCard";
import { StudyPlanCard } from "@/components/dashboard/StudyPlanCard";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const { user } = useAuth();
  
  useEffect(() => {
    const checkExistingPlan = async () => {
      if (user && !(await hasExistingPlan())) {
        setShowPlanForm(true);
      }
    };
    
    checkExistingPlan();
  }, [user]);
  
  useEffect(() => {
    const updateProgress = () => {
      const completionRate = calculateCompletionRate();
      setProgressValue(completionRate);
    };
    
    updateProgress();
    
    const intervalId = setInterval(updateProgress, 60000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const handlePlanComplete = () => {
    setShowPlanForm(false);
    const completionRate = calculateCompletionRate();
    setProgressValue(completionRate);
    toast.success("Study plan updated successfully!");
  };
  
  return (
    <div className="min-h-screen bg-background p-6">
      <DashboardHeader />
      
      <div className="grid grid-cols-1 gap-4">
        <AIChatCard />
        <ProgressCard progressValue={progressValue} />
        <StudyPlanCard onEditPlan={() => setShowPlanForm(true)} />
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
