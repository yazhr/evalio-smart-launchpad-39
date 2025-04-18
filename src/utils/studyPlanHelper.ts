
import { getWeeklyPlan } from "./studyPlanStorage";

/**
 * Calculates the current completion rate of study sessions
 * @returns A number between 0-100 representing completion percentage
 */
export const calculateCompletionRate = (): number => {
  const plan = getWeeklyPlan();
  if (!plan || !plan.sessions || plan.sessions.length === 0) {
    return 0;
  }
  
  const completed = plan.sessions.filter(session => session.completed).length;
  const total = plan.sessions.length;
  
  return total > 0 ? (completed / total) * 100 : 0;
};

/**
 * Gets the current week number in the year
 * Used to track weekly progress resets
 */
export const getCurrentWeekNumber = (): number => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneWeek = 604800000; // milliseconds in a week
  return Math.floor(diff / oneWeek) + 1;
};

/**
 * Resets weekly progress if needed
 * Should be called when loading the dashboard
 */
export const checkAndResetWeeklyProgress = (): boolean => {
  const plan = getWeeklyPlan();
  if (!plan) return false;
  
  const storedWeek = localStorage.getItem('studysmart_current_week');
  const currentWeek = getCurrentWeekNumber().toString();
  
  if (storedWeek !== currentWeek) {
    // It's a new week, reset completion status
    localStorage.setItem('studysmart_current_week', currentWeek);
    
    if (plan.sessions) {
      plan.sessions = plan.sessions.map(session => ({
        ...session,
        completed: false
      }));
      
      // Save the updated plan with reset completion status
      localStorage.setItem('studysmart_weekly_plan', JSON.stringify(plan));
      return true; // Progress was reset
    }
  }
  
  return false; // No reset needed
};
