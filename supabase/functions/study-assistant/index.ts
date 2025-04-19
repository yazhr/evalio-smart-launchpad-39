
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Using the provided OpenAI API key
const OPENAI_API_KEY = "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";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fallback responses when OpenAI API is unavailable
const fallbackResponses = [
  "I'm sorry, but I'm currently experiencing connectivity issues. The OpenAI service appears to be unavailable due to quota limitations. Here are some general study tips in the meantime: Try using the Pomodoro technique - study for 25 minutes, then take a 5-minute break.",
  "It seems that I can't connect to my knowledge base right now due to API quota limitations. While we work on this, consider trying spaced repetition for memorizing important concepts - review material at increasing intervals to improve retention.",
  "I apologize, but I'm having trouble accessing OpenAI services due to quota limits. Here's a study tip while we resolve this: Create mind maps to visualize connections between different topics and improve your understanding of complex subjects.",
  "The OpenAI service is currently unavailable due to quota limits. While this is being addressed, try this study technique: Teach the material to someone else (or pretend to). Explaining concepts out loud helps solidify your understanding.",
  "I can't access my full capabilities right now due to OpenAI API quota limitations. In the meantime, consider creating flashcards for key terms and concepts - they're excellent for quick reviews before exams."
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

    // Enhanced system message for better educational responses
    const systemMessage = `You are an intelligent study assistant helping students learn effectively.
    Focus on providing clear, accurate academic guidance and study tips.
    Be encouraging and supportive while maintaining academic professionalism.
    Base your responses on proven educational methods and accurate subject knowledge.
    When appropriate, suggest specific study techniques like spaced repetition, active recall, or the Pomodoro method.
    If asked about a specific subject, provide well-structured explanations with examples.`;

    console.log('Making request to OpenAI API...');
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: message }
          ],
          temperature: 0.7,
          max_tokens: 1024,
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('OpenAI API error status:', response.status);
        console.error('OpenAI API error response:', data);
        
        if (response.status === 429 || data.error?.type === 'insufficient_quota') {
          // Specifically handle quota exceeded errors with a more helpful message
          const fallbackResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
          return new Response(JSON.stringify({ 
            reply: fallbackResponse,
            error: "API_QUOTA_EXCEEDED" 
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200, // Return 200 with error info instead of 500
          });
        }
        
        throw new Error(`OpenAI API error: ${data.error?.message || response.statusText}`);
      }

      // Check if the response has the expected structure
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('Unexpected API response structure:', data);
        throw new Error('Invalid response structure from OpenAI API');
      }

      const reply = data.choices[0].message.content;
      console.log('Received reply from OpenAI (first 100 chars):', reply.substring(0, 100) + '...');

      return new Response(JSON.stringify({ reply }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    } catch (apiError) {
      console.error('Error calling OpenAI API:', apiError.message);
      
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
