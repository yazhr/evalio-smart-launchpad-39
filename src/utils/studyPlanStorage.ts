
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";
import { WeeklyStudyPlan, StudySubject, DailyStudyTime, StudySession } from "@/types/studyPlan";
import { useAuth } from "@/hooks/useAuth";

export const saveWeeklyPlan = async (plan: WeeklyStudyPlan): Promise<WeeklyStudyPlan | null> => {
  const { user } = useAuth();
  if (!user) return null;

  const { data, error } = await supabase
    .from('study_plans')
    .upsert({
      user_id: user.id,
      subjects: plan.subjects,
      daily_times: plan.dailyTimes,
      last_generated: new Date().toISOString()
    })
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
      user_id: user.id,
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
  const { user } = useAuth();
  if (!user) return null;

  const { data: planData, error: planError } = await supabase
    .from('study_plans')
    .select('*')
    .eq('user_id', user.id)
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
    .eq('user_id', user.id)
    .eq('plan_id', planData.id);

  if (sessionsError) {
    console.error('Error fetching study sessions:', sessionsError);
    return null;
  }

  return {
    subjects: planData.subjects,
    dailyTimes: planData.daily_times,
    sessions: sessionsData || [],
    lastGenerated: planData.last_generated
  };
};

export const hasExistingPlan = async (): Promise<boolean> => {
  const { user } = useAuth();
  if (!user) return false;

  const { data, error } = await supabase
    .from('study_plans')
    .select('id')
    .eq('user_id', user.id)
    .limit(1)
    .single();

  return !!data && !error;
};

export const deleteWeeklyPlan = async (): Promise<boolean> => {
  const { user } = useAuth();
  if (!user) return false;

  const { data: planData, error: planFetchError } = await supabase
    .from('study_plans')
    .select('id')
    .eq('user_id', user.id)
    .limit(1)
    .single();

  if (planFetchError || !planData) return false;

  const { error: sessionDeleteError } = await supabase
    .from('study_sessions')
    .delete()
    .eq('user_id', user.id)
    .eq('plan_id', planData.id);

  const { error: planDeleteError } = await supabase
    .from('study_plans')
    .delete()
    .eq('user_id', user.id);

  return !sessionDeleteError && !planDeleteError;
};

export const markSessionComplete = async (sessionId: string): Promise<boolean> => {
  const { user } = useAuth();
  if (!user) return false;

  const { error } = await supabase
    .from('study_sessions')
    .update({ completed: true })
    .eq('id', sessionId)
    .eq('user_id', user.id);

  return !error;
};

