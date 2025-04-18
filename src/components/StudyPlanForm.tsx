import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { StudySubject, DailyStudyTime, WeeklyStudyPlan } from "@/types/studyPlan";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { X, Plus, BookOpen, Clock, Calendar, ChevronRight, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { saveWeeklyPlan, generateStudyPlan, getWeeklyPlan } from "@/utils/studyPlanStorage";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";

interface StudyPlanFormProps {
  onComplete: () => void;
}

const StudyPlanForm: React.FC<StudyPlanFormProps> = ({ onComplete }) => {
  const existingPlan = getWeeklyPlan();
  
  const [activeTab, setActiveTab] = useState("subjects");
  const [subjects, setSubjects] = useState<StudySubject[]>(
    existingPlan?.subjects?.length ? existingPlan.subjects : [
      { id: uuidv4(), name: "Mathematics", topics: [] },
    ]
  );
  
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const [dailyTimes, setDailyTimes] = useState<DailyStudyTime[]>(
    existingPlan?.dailyTimes?.length ? existingPlan.dailyTimes : days.map(day => ({
      day,
      startTime: "09:00",
      endTime: "10:00",
      enabled: day !== "Saturday" && day !== "Sunday", // Weekdays enabled by default
    }))
  );
  
  const addSubject = () => {
    setSubjects([...subjects, { id: uuidv4(), name: "", topics: [] }]);
  };
  
  const removeSubject = (id: string) => {
    setSubjects(subjects.filter(subject => subject.id !== id));
  };
  
  const updateSubject = (id: string, name: string) => {
    setSubjects(
      subjects.map(subject =>
        subject.id === id ? { ...subject, name } : subject
      )
    );
  };
  
  const addTopic = (subjectId: string) => {
    setSubjects(
      subjects.map(subject =>
        subject.id === subjectId
          ? {
              ...subject,
              topics: [...subject.topics, { id: uuidv4(), name: "" }],
            }
          : subject
      )
    );
  };
  
  const removeTopic = (subjectId: string, topicId: string) => {
    setSubjects(
      subjects.map(subject =>
        subject.id === subjectId
          ? {
              ...subject,
              topics: subject.topics.filter(topic => topic.id !== topicId),
            }
          : subject
      )
    );
  };
  
  const updateTopic = (subjectId: string, topicId: string, name: string) => {
    setSubjects(
      subjects.map(subject =>
        subject.id === subjectId
          ? {
              ...subject,
              topics: subject.topics.map(topic =>
                topic.id === topicId ? { ...topic, name } : topic
              ),
            }
          : subject
      )
    );
  };
  
  const updateDailyTime = (index: number, field: keyof DailyStudyTime, value: string | boolean) => {
    const newDailyTimes = [...dailyTimes];
    newDailyTimes[index] = {
      ...newDailyTimes[index],
      [field]: value,
    };
    setDailyTimes(newDailyTimes);
  };
  
  const handleNext = () => {
    if (activeTab === "subjects") {
      // Validate subjects and topics
      const validSubjects = subjects.filter(subject => subject.name.trim() !== "");
      if (validSubjects.length === 0) {
        toast.error("Please add at least one subject");
        return;
      }
      
      const allTopicsValid = validSubjects.every(subject => 
        subject.topics.length > 0 && subject.topics.every(topic => topic.name.trim() !== "")
      );
      
      if (!allTopicsValid) {
        toast.error("Please add at least one topic for each subject");
        return;
      }
      
      setActiveTab("schedule");
    } else if (activeTab === "schedule") {
      // Validate schedule
      const enabledDays = dailyTimes.filter(time => time.enabled);
      if (enabledDays.length === 0) {
        toast.error("Please enable at least one day for studying");
        return;
      }
      
      // Create and save the study plan
      const filteredSubjects = subjects.filter(s => s.name.trim() !== "");
      filteredSubjects.forEach(subject => {
        subject.topics = subject.topics.filter(t => t.name.trim() !== "");
      });
      
      const sessions = generateStudyPlan(filteredSubjects, dailyTimes);
      
      const weeklyPlan: WeeklyStudyPlan = {
        subjects: filteredSubjects,
        dailyTimes,
        sessions,
        lastGenerated: new Date().toISOString(),
      };
      
      // Set the current week number for progress tracking
      const currentWeek = getCurrentWeekNumber();
      localStorage.setItem('studysmart_current_week', currentWeek.toString());
      
      saveWeeklyPlan(weeklyPlan);
      onComplete();
    }
  };
  
  // Helper function to get current week number
  const getCurrentWeekNumber = (): number => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    const oneWeek = 604800000; // milliseconds in a week
    return Math.floor(diff / oneWeek) + 1;
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto border-none shadow-lg bg-background/95 backdrop-blur-xl">
      <CardHeader className="space-y-2 bg-gradient-to-r from-background/80 to-muted/50 rounded-t-xl border-b border-border/20">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Study Plan Configuration
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground">
          Design your personalized study schedule with detailed subjects and timing
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-6 p-1 bg-muted/30 backdrop-blur-sm border border-border/20 rounded-lg">
            <TabsTrigger 
              value="subjects" 
              className="flex items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md data-[state=active]:backdrop-blur-xl transition-all duration-300 relative rounded-md"
            >
              <BookOpen className="h-4 w-4" />
              Subjects & Topics
              {activeTab === "subjects" && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute inset-0 bg-primary/10 rounded-md -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="schedule" 
              className="flex items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md data-[state=active]:backdrop-blur-xl transition-all duration-300 relative rounded-md"
            >
              <Calendar className="h-4 w-4" />
              Weekly Schedule
              {activeTab === "schedule" && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute inset-0 bg-primary/10 rounded-md -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="subjects" className="space-y-6">
            <div className="space-y-4">
              <AnimatePresence>
                {subjects.map((subject, index) => (
                  <motion.div
                    key={subject.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 rounded-lg border border-border/50 bg-muted/30 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-sm font-medium">
                        {index + 1}
                      </div>
                      <Input
                        value={subject.name}
                        onChange={(e) => updateSubject(subject.id, e.target.value)}
                        placeholder="Enter subject name"
                        className="flex-1 border-border/50 bg-background/50"
                      />
                      {subjects.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSubject(subject.id)}
                          className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="mt-4 pl-9 space-y-3">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <h4 className="font-medium">Topics</h4>
                        <Separator className="flex-1 mx-4" />
                      </div>
                      
                      <AnimatePresence>
                        {subject.topics.map((topic, topicIndex) => (
                          <motion.div 
                            key={topic.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-2"
                          >
                            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-secondary/20 text-secondary text-xs font-medium">
                              {topicIndex + 1}
                            </div>
                            <Input
                              value={topic.name}
                              onChange={(e) => updateTopic(subject.id, topic.id, e.target.value)}
                              placeholder="Enter topic name"
                              className="flex-1 h-8 text-sm border-border/50 bg-background/50"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeTopic(subject.id, topic.id)}
                              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addTopic(subject.id)}
                        className="text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" /> Add Topic
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              <Button
                type="button"
                variant="outline"
                onClick={addSubject}
                className="w-full border-dashed"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Subject
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="schedule" className="space-y-4">
            <div className="grid gap-3">
              <AnimatePresence>
                {dailyTimes.map((timeSlot, index) => (
                  <motion.div
                    key={timeSlot.day}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border border-border/50 bg-muted/30"
                  >
                    <div className="flex items-center gap-3 min-w-[140px]">
                      <Switch
                        checked={timeSlot.enabled}
                        onCheckedChange={(checked) => updateDailyTime(index, 'enabled', checked)}
                      />
                      <span className="font-medium">{timeSlot.day}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex flex-col gap-1.5 flex-1">
                        <span className="text-xs text-muted-foreground">Start Time</span>
                        <Input
                          type="time"
                          value={timeSlot.startTime}
                          onChange={(e) => updateDailyTime(index, 'startTime', e.target.value)}
                          disabled={!timeSlot.enabled}
                          className={!timeSlot.enabled ? "opacity-50" : ""}
                        />
                      </div>
                      
                      <div className="flex flex-col gap-1.5 flex-1">
                        <span className="text-xs text-muted-foreground">End Time</span>
                        <Input
                          type="time"
                          value={timeSlot.endTime}
                          onChange={(e) => updateDailyTime(index, 'endTime', e.target.value)}
                          disabled={!timeSlot.enabled}
                          className={!timeSlot.enabled ? "opacity-50" : ""}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between p-6 bg-gradient-to-b from-transparent to-muted/20 rounded-b-xl border-t border-border/20">
        {activeTab === "schedule" ? (
          <Button variant="outline" onClick={() => setActiveTab("subjects")} className="gap-2">
            <ChevronLeft className="h-4 w-4" /> Back to Subjects
          </Button>
        ) : (
          <div></div>
        )}
        <Button 
          onClick={handleNext} 
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {activeTab === "subjects" ? (
            <>
              Continue to Schedule <ChevronRight className="h-4 w-4" />
            </>
          ) : (
            <>
              Create Study Plan <Calendar className="h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StudyPlanForm;
