
export interface StudyTopic {
  id: string;
  name: string;
}

export interface StudySubject {
  id: string;
  name: string;
  topics: StudyTopic[];
}

export interface DailyStudyTime {
  day: string;
  startTime: string;
  endTime: string;
  enabled: boolean;
}

export interface StudySession {
  id: string;
  day: string;
  subject: string;
  topic: string;
  time: string;
  duration: string;
  completed: boolean;
}

export interface WeeklyStudyPlan {
  subjects: StudySubject[];
  dailyTimes: DailyStudyTime[];
  sessions: StudySession[];
  lastGenerated: string;
}
