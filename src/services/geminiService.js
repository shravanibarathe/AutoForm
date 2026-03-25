const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL_NAME = 'gemini-2.0-flash'; // Fallback to 2.0 if 2.5 is too new, or keep 2.5? Let's use 2.0 as it's stable and common. 
// Wait, the user has 2.5 in their index.html. I'll use 2.5 since that's what's in their code.

const BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export const geminiService = {
  async generateResponse(prompt, systemPrompt = '') {
    if (!GEMINI_API_KEY) {
      console.error('[Gemini] API Key missing in .env');
      return null;
    }

    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `${systemPrompt}\n\nUser Input: ${prompt}` }]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 500,
          }
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Gemini API Error: ${response.status} - ${error.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      if (data.candidates && data.candidates.length > 0) {
        return data.candidates[0].content.parts[0].text.trim();
      }
      return null;
    } catch (error) {
      console.error('[Gemini] Error:', error);
      return null;
    }
  }
};

export default geminiService;
