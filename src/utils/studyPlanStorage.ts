
import { v4 as uuidv4 } from "uuid";
import { WeeklyStudyPlan, StudySubject, DailyStudyTime, StudySession } from "@/types/studyPlan";

const PLAN_STORAGE_KEY = "studysmart_weekly_plan";

export const saveWeeklyPlan = (plan: WeeklyStudyPlan): void => {
  localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(plan));
};

export const getWeeklyPlan = (): WeeklyStudyPlan | null => {
  const planJson = localStorage.getItem(PLAN_STORAGE_KEY);
  if (!planJson) return null;
  
  try {
    return JSON.parse(planJson) as WeeklyStudyPlan;
  } catch (e) {
    console.error("Error parsing weekly plan:", e);
    return null;
  }
};

export const hasExistingPlan = (): boolean => {
  return localStorage.getItem(PLAN_STORAGE_KEY) !== null;
};

export const generateStudyPlan = (subjects: StudySubject[], dailyTimes: DailyStudyTime[]): StudySession[] => {
  // Days of the week
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const sessions: StudySession[] = [];
  
  // For each enabled day
  dailyTimes.filter(t => t.enabled).forEach(timeSlot => {
    // Find matching day
    const dayIndex = days.findIndex(d => d === timeSlot.day);
    if (dayIndex === -1) return;
    
    // For simplicity, assign one subject per day in rotation
    subjects.forEach((subject, subjectIndex) => {
      if (subject.topics.length === 0) return;
      
      // Use modulo to distribute topics
      const topicIndex = (dayIndex + subjectIndex) % subject.topics.length;
      const topic = subject.topics[topicIndex];
      
      // Calculate study duration (default to 1 hour if times not properly set)
      let duration = "1 hour";
      try {
        const start = new Date(`2000-01-01T${timeSlot.startTime}`);
        const end = new Date(`2000-01-01T${timeSlot.endTime}`);
        const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        duration = `${Math.max(0.5, Math.round(diffHours * 2) / 2)} hours`;
      } catch (e) {
        console.error("Error calculating duration:", e);
      }
      
      sessions.push({
        id: uuidv4(),
        day: timeSlot.day,
        subject: subject.name,
        topic: topic.name,
        time: timeSlot.startTime,
        duration,
        completed: false
      });
    });
  });
  
  return sessions;
};

export const deleteWeeklyPlan = (): void => {
  localStorage.removeItem(PLAN_STORAGE_KEY);
};

export const markSessionComplete = (sessionId: string): boolean => {
  const plan = getWeeklyPlan();
  if (!plan || !plan.sessions) return false;
  
  const updatedSessions = plan.sessions.map(session => 
    session.id === sessionId ? { ...session, completed: true } : session
  );
  
  plan.sessions = updatedSessions;
  saveWeeklyPlan(plan);
  
  return true;
};
