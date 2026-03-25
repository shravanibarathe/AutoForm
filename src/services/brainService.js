import ollama from './ollamaService';
import gemini from './geminiService';

// Set this to true to use Gemini, false for local Ollama
const USE_GEMINI = true; 

export const brainService = {
  async processTurn(transcript, currentFormData, currentField) {
    console.log(`[Brain] Thinking about: "${transcript}" using ${USE_GEMINI ? 'Gemini' : 'Ollama'}`);
    
    const prompt = `
      You are the "VoiceRecruit AI Assistant", a friendly recruitment expert.
      
      CURRENT FORM STATE:
      ${JSON.stringify(currentFormData, null, 2)}
      
      USER SAID: "${transcript}"
      FIELD CURRENTLY ASKED: ${currentField}
      
      YOUR JOB:
      1. EXTRACT: Analyze the USER SAID. Extract values for: name, email, phone, currentPosition, experience, skills, education, desiredPosition, salary, noticePeriod. 
      2. SYNC: If the CURRENT FORM STATE already has a value for a field, DO NOT ask for it again.
      3. REPLY: 
         - Acknowledge exactly what you heard (e.g., "Got it, 10 years of experience.").
         - If the user repeated information you already have, simply say "I have that recorded. Next..." and ask the next missing thing.
         - FIND the first field in the list above that is empty and ask for it specifically.
         - DO NOT give one-word answers like "And" or "Ok".
         - Be polite but very brief (max 15 words).
      4. SUBMIT: Set "shouldSubmit" to true if the user explicitly wants to finish, e.g., "submit", "send it", "done", "finished", "completed".
      5. COMPLETION: If all fields are filled, suggest they say "submit" to finish.
      
      STRICT JSON OUTPUT (No markdown, no preamble):
      {
        "extracted": { "field": "value" },
        "reply": "Example: Great, got your email. What is your phone number?",
        "shouldSubmit": false
      }
    `;

    try {
      const response = USE_GEMINI 
        ? await gemini.generateResponse(prompt)
        : await ollama.generateResponse(prompt);
      
      console.log('[Brain] AI Raw Response:', response);
      if (!response) return null;

      // Clean the response: sometimes models add markdown or preamble
      const jsonStr = response.match(/\{[\s\S]*\}/)?.[0] || response;
      const parsed = JSON.parse(jsonStr);
      
      console.log('[Brain] Parsed Result:', parsed);
      return parsed;
    } catch (e) {
      console.error('[Brain] Error processing turn:', e);
      return null;
    }
  }
};

export default brainService;
