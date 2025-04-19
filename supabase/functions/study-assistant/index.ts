
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Using Gemini API key
const GEMINI_API_KEY = "AIzaSyBLhHeMpYiajxLXz-HGegjkoAXZhLju5GY";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fallback responses when API is unavailable
const fallbackResponses = [
  "I'm sorry, but I'm currently experiencing connectivity issues. The AI service appears to be unavailable. Here are some general study tips in the meantime: Try using the Pomodoro technique - study for 25 minutes, then take a 5-minute break.",
  "It seems that I can't connect to my knowledge base right now. While we work on this, consider trying spaced repetition for memorizing important concepts - review material at increasing intervals to improve retention.",
  "I apologize, but I'm having trouble accessing AI services. Here's a study tip while we resolve this: Create mind maps to visualize connections between different topics and improve your understanding of complex subjects.",
  "The AI service is currently unavailable. While this is being addressed, try this study technique: Teach the material to someone else (or pretend to). Explaining concepts out loud helps solidify your understanding.",
  "I can't access my full capabilities right now. In the meantime, consider creating flashcards for key terms and concepts - they're excellent for quick reviews before exams."
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    
    console.log('Study Assistant function called with message:', message);
    
    if (!message || typeof message !== 'string') {
      throw new Error('Invalid request: message must be a string');
    }

    // System context for educational responses
    const systemContext = `You are an intelligent study assistant helping students learn effectively.
    Focus on providing clear, accurate academic guidance and study tips.
    Be encouraging and supportive while maintaining academic professionalism.
    Base your responses on proven educational methods and accurate subject knowledge.
    When appropriate, suggest specific study techniques like spaced repetition, active recall, or the Pomodoro method.
    If asked about a specific subject, provide well-structured explanations with examples.`;

    console.log('Making request to Gemini API...');
    try {
      // Format for Gemini API request
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: systemContext },
              { text: message }
            ]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          }
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Gemini API error status:', response.status);
        console.error('Gemini API error response:', data);
        
        if (response.status === 429 || data.error?.status === 'RESOURCE_EXHAUSTED') {
          // Handle quota exceeded errors with a more helpful message
          const fallbackResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
          return new Response(JSON.stringify({ 
            reply: fallbackResponse,
            error: "API_QUOTA_EXCEEDED" 
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200, // Return 200 with error info instead of 500
          });
        }
        
        throw new Error(`Gemini API error: ${data.error?.message || response.statusText}`);
      }

      // Extract reply from Gemini response format
      let reply = "";
      if (data.candidates && data.candidates[0]?.content?.parts?.length > 0) {
        reply = data.candidates[0].content.parts[0].text;
      } else {
        console.error('Unexpected API response structure:', data);
        throw new Error('Invalid response structure from Gemini API');
      }

      console.log('Received reply from Gemini (first 100 chars):', reply.substring(0, 100) + '...');

      return new Response(JSON.stringify({ reply }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    } catch (apiError) {
      console.error('Error calling Gemini API:', apiError.message);
      
      // Provide a fallback response instead of failing
      const fallbackResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      return new Response(JSON.stringify({ 
        reply: fallbackResponse,
        error: apiError.message 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Return 200 with error info instead of 500
      });
    }
  } catch (error) {
    console.error('Error in study-assistant function:', error.message);
    return new Response(JSON.stringify({ 
      error: error.message,
      reply: "I'm sorry, but I encountered an error processing your request. Please try again in a moment." 
    }), {
      status: 200, // Return 200 with error info instead of 500
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
