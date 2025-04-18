
import { useState, useEffect } from 'react';

const quotes = [
  "The expert in anything was once a beginner.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The secret of getting ahead is getting started.",
  "The future depends on what you do today.",
  "Don't let what you cannot do interfere with what you can do.",
  "Learning is never done without errors and defeat.",
  "Education is not preparation for life; education is life itself.",
];

const tips = [
  "Break your study sessions into 25-minute chunks with 5-minute breaks.",
  "Review your notes within 24 hours of taking them to improve retention.",
  "Teach what you've learned to someone else to reinforce understanding.",
  "Create mind maps to visualize connections between concepts.",
  "Take regular breaks to maintain focus and productivity.",
  "Stay hydrated and maintain good posture while studying.",
  "Use active recall instead of passive reading.",
];

export const useQuoteOfTheDay = () => {
  const [quote, setQuote] = useState('');
  const [tip, setTip] = useState('');

  useEffect(() => {
    // Get today's date as string to use as seed
    const today = new Date().toDateString();
    
    // Simple hash function to get consistent but different numbers for quotes and tips
    const hash = (str: string, max: number) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash = hash & hash;
      }
      return Math.abs(hash) % max;
    };

    const quoteIndex = hash(today, quotes.length);
    const tipIndex = hash(today + 'tip', tips.length);

    setQuote(quotes[quoteIndex]);
    setTip(tips[tipIndex]);
  }, []);

  return { quote, tip };
};
