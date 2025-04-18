import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";
import { WeeklyStudyPlan, StudySubject, DailyStudyTime, StudySession } from "@/types/studyPlan";
import { Json } from "@/integrations/supabase/types";

// Helper function to get the current user ID
const getCurrentUserId = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session?.user?.id;
};

export const saveWeeklyPlan = async (plan: WeeklyStudyPlan): Promise<WeeklyStudyPlan | null> => {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  // Convert objects to JSON for storage
  const subjectsJson = plan.subjects as any;
  const dailyTimesJson = plan.dailyTimes as any;

  // Using array for upsert as expected by Supabase
  const { data, error } = await supabase
    .from('study_plans')
    .upsert([{
      user_id: userId,
      subjects: subjectsJson,
      daily_times: dailyTimesJson,
      last_generated: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    console.error('Error saving weekly plan:', error);
    return null;
  }

  // Save sessions separately
  if (plan.sessions && plan.sessions.length > 0) {
    const sessionsToSave = plan.sessions.map(session => ({
      ...session,
      user_id: userId,
      plan_id: data.id
    }));

    const { error: sessionError } = await supabase
      .from('study_sessions')
      .upsert(sessionsToSave);

    if (sessionError) {
      console.error('Error saving study sessions:', sessionError);
    }
  }

  return plan;
};

export const getWeeklyPlan = async (): Promise<WeeklyStudyPlan | null> => {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  const { data: planData, error: planError } = await supabase
    .from('study_plans')
    .select('*')
    .eq('user_id', userId)
    .order('last_generated', { ascending: false })
    .limit(1)
    .single();

  if (planError) {
    console.error('Error fetching weekly plan:', planError);
    return null;
  }

  if (!planData) return null;

  const { data: sessionsData, error: sessionsError } = await supabase
    .from('study_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('plan_id', planData.id);

  if (sessionsError) {
    console.error('Error fetching study sessions:', sessionsError);
    return null;
  }

  // Use proper type assertions with unknown as an intermediary step
  // This properly handles the conversion from the Json type to our specific types
  return {
    subjects: (planData.subjects as unknown) as StudySubject[],
    dailyTimes: (planData.daily_times as unknown) as DailyStudyTime[],
    sessions: sessionsData || [],
    lastGenerated: planData.last_generated
  };
};

export const hasExistingPlan = async (): Promise<boolean> => {
  const userId = await getCurrentUserId();
  if (!userId) return false;

  const { data, error } = await supabase
    .from('study_plans')
    .select('id')
    .eq('user_id', userId)
    .limit(1);

  return !!data && data.length > 0 && !error;
};

export const deleteWeeklyPlan = async (): Promise<boolean> => {
  const userId = await getCurrentUserId();
  if (!userId) return false;

  const { data: planData, error: planFetchError } = await supabase
    .from('study_plans')
    .select('id')
    .eq('user_id', userId)
    .limit(1);

  if (planFetchError || !planData || planData.length === 0) return false;

  const { error: sessionDeleteError } = await supabase
    .from('study_sessions')
    .delete()
    .eq('user_id', userId)
    .eq('plan_id', planData[0].id);

  const { error: planDeleteError } = await supabase
    .from('study_plans')
    .delete()
    .eq('user_id', userId);

  return !sessionDeleteError && !planDeleteError;
};

export const markSessionComplete = async (sessionId: string): Promise<boolean> => {
  const userId = await getCurrentUserId();
  if (!userId) return false;

  const { error } = await supabase
    .from('study_sessions')
    .update({ completed: true })
    .eq('id', sessionId)
    .eq('user_id', userId);

  return !error;
};

// Generate study plan from subjects and daily times
export const generateStudyPlan = (subjects: StudySubject[], dailyTimes: DailyStudyTime[]): StudySession[] => {
  const sessions: StudySession[] = [];
  const enabledDays = dailyTimes.filter(day => day.enabled);
  
  if (enabledDays.length === 0 || subjects.length === 0) {
    return sessions;
  }
  
  subjects.forEach(subject => {
    if (!subject.topics || subject.topics.length === 0) return;
    
    subject.topics.forEach((topic, topicIndex) => {
      // Distribute topics across enabled days
      const dayIndex = topicIndex % enabledDays.length;
      const day = enabledDays[dayIndex];
      
      // Calculate a study time within the day's range
      const startHour = parseInt(day.startTime.split(':')[0]);
      const endHour = parseInt(day.endTime.split(':')[0]);
      const hourRange = endHour - startHour;
      
      // Simple distribution - could be made more sophisticated
      const studyHour = startHour + (topicIndex % Math.max(1, hourRange));
      const studyTime = `${studyHour.toString().padStart(2, '0')}:00`;
      
      // Create a session
      sessions.push({
        id: uuidv4(),
        day: day.day,
        subject: subject.name,
        topic: topic.name,
        time: studyTime,
        duration: "1 hour",
        completed: false
      });
    });
  });
  
  return sessions;
};
