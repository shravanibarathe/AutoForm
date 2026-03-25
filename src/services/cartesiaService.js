export const cartesiaService = {
  async textToSpeech(text) {
    const apiKey = import.meta.env.VITE_CARTESIA_API_KEY;
    const version = "2025-04-16";

    if (!apiKey) {
      console.error('[Cartesia] API Key missing in .env');
      return null;
    }

    console.log(`[Cartesia] Requesting TTS for: "${text.substring(0, 30)}..."`);

    try {
      const response = await fetch("https://api.cartesia.ai/tts/bytes", {
        method: "POST",
        headers: {
          "Cartesia-Version": version,
          "X-API-Key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model_id: "sonic-3",
          transcript: text,
          voice: {
            mode: "id",
            id: "95d51f79-c397-46f9-b49a-23763d3eaa2d"
          },
          output_format: {
            container: "wav",
            encoding: "pcm_f32le",
            sample_rate: 44100
          },
          speed: "normal",
          generation_config: {
            speed: 1,
            volume: 1
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Cartesia API Error: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('[Cartesia] TTS Error:', error);
      return null;
    }
  }
};

export default cartesiaService;
