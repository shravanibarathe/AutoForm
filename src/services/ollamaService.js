const OLLAMA_URL = 'http://localhost:11434/api/generate';
const MODEL = 'llama3.2:3b';

export const ollamaService = {
  async generateResponse(prompt, systemPrompt = '') {
    console.log(`[Ollama] Requesting response from model: ${MODEL}`);
    try {
      const response = await fetch(OLLAMA_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: MODEL,
          prompt: prompt,
          system: systemPrompt,
          stream: false,
          options: {
            temperature: 0.1, 
            num_predict: 500, // Reduced for faster non-reasoning responses
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Ollama connection failed. Ensure Ollama is running and OLLAMA_ORIGINS is set.');
      }

      const data = await response.json();
      let rawText = data.response.trim();
      
      // Clean DeepSeek-R1 reasoning blocks
      rawText = rawText.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
      
      return rawText;
    } catch (error) {
      console.error('Ollama Error:', error);
      return null;
    }
  },

  async extractData(text, schema) {
    const prompt = `
      CONVERSATION: "${text}"
      SCHEMA: ${JSON.stringify(schema)}
      
      INSTRUCTIONS:
      1. Extract information from the CONVERSATION based on the SCHEMA.
      2. IMPORTANT: If information is repeated or corrected, use the LATEST mentioned value.
      3. CLEANUP: Remove conversational filler.
      4. CONCISENESS: Form fields should be short.
      5. MISSING: Use 'null' for missing fields.
      6. Output ONLY raw valid JSON. No markdown, no backticks, no text.
    `;

    const systemPrompt = "You are a professional recruiting data extractor. You convert messy transcripts into clean, concise JSON. You are expert at identifying corrections.";

    try {
      const response = await this.generateResponse(prompt, systemPrompt);
      if (!response) return null;
      
      // Find the JSON block in the cleaned response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (e) {
          console.error('JSON Parse Error inside extractData:', e);
          return null;
        }
      }
      return null;
    } catch (error) {
      console.error('Extraction Error:', error);
      return null;
    }
  }
};

export default ollamaService;
