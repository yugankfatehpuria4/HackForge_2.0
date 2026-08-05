// Remove the node-fetch import since we'll use built-in fetch
// const fetch = require('node-fetch');

class GeminiService {
  constructor() {
    // Trim whitespace and strip surrounding quotes. A key pasted with a
    // trailing space or newline, or wrapped in quotes in the .env file,
    // produces a malformed header and Google replies with a confusing
    // "401 Expected OAuth 2 access token" rather than "bad API key".
    const raw = (process.env.GEMINI_API_KEY || '').trim().replace(/^["']|["']$/g, '');

    if (!raw) {
      console.log('⚠️  Gemini API key not provided in backend/.env file');
      this.apiKey = null;
      return;
    }

    if (raw === 'your_gemini_api_key_here') {
      console.log('⚠️  Please replace the placeholder Gemini API key with your actual key');
      this.apiKey = null;
      return;
    }

    // Google AI Studio keys look like "AIza..." and are ~39 characters.
    // Warn rather than refuse, in case the format ever changes.
    if (!/^AIza[\w-]{30,}$/.test(raw)) {
      console.warn(
        `⚠️  GEMINI_API_KEY does not look like a Google AI Studio key (expected "AIza…", got "${raw.slice(0, 6)}…" of length ${raw.length}). ` +
          'Get one at https://aistudio.google.com/apikey'
      );
    }

    this.apiKey = raw;
    console.log('✅ Gemini service initialized successfully');
  }

  async generateCode(prompt) {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured. Please add your API key to backend/.env file.');
    }

    try {
      console.log('🤖 Calling Gemini API...');
      
      const systemPrompt = 'You are an expert full-stack developer. Generate clean, production-ready code based on the user\'s requirements. Include proper error handling, comments, and follow best practices. Provide complete, working code that can be used immediately.';
      
      const fullPrompt = `${systemPrompt}\n\nUser request: ${prompt}`;
      
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": this.apiKey
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: fullPrompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            // 2000 tokens truncated almost every multi-file generation
            // mid-function. gemini-2.0-flash supports 8192 output tokens.
            maxOutputTokens: 8192,
            topP: 0.8,
            topK: 40
          }
        })
      });

      if (!response.ok) {
        // A non-JSON error body (gateway HTML, empty 502) made .json() throw
        // and masked the real status code.
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Gemini API Error (${response.status}): ${errorData.error?.message || response.statusText}`
        );
      }

      const data = await response.json();
      console.log('✅ Gemini API response received');

      // A prompt rejected by the safety filters comes back with no candidates.
      if (data.promptFeedback?.blockReason) {
        throw new Error(
          `Prompt was blocked by Gemini safety filters (${data.promptFeedback.blockReason}). Try rephrasing your description.`
        );
      }

      const candidate = data.candidates?.[0];
      const text = candidate?.content?.parts
        ?.map((part) => part.text)
        .filter(Boolean)
        .join('');

      if (!text) {
        // Previously this path did `parts[0].text` unguarded and threw a
        // TypeError whenever the response was blocked or empty.
        throw new Error(
          candidate?.finishReason
            ? `Gemini returned no code (finishReason: ${candidate.finishReason}).`
            : 'Invalid response format from Gemini API'
        );
      }

      if (candidate.finishReason === 'MAX_TOKENS') {
        console.warn('⚠️  Gemini response hit the output token limit and may be truncated');
      }

      return text;
    } catch (error) {
      console.error('❌ Gemini API Error:', error.message);
      
      if (error.message.includes('API_KEY_INVALID')) {
        throw new Error('Invalid Gemini API key. Please check your API key.');
      } else if (error.message.includes('quota')) {
        throw new Error('Gemini API quota exceeded. Please check your billing.');
      } else if (error.message.includes('model_not_found')) {
        throw new Error('Gemini model not available. Please try again later.');
      }
      
      throw new Error(`Gemini API Error: ${error.message}`);
    }
  }
}

module.exports = new GeminiService(); 