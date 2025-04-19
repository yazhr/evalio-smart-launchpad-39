
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Using the provided OpenAI API key
const OPENAI_API_KEY = "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";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
  } catch (error) {
    console.error('Error in study-assistant function:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
