// Remove the node-fetch import since we'll use built-in fetch
// const fetch = require('node-fetch');

class GeminiService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      console.log('⚠️  Gemini API key not provided in backend/.env file');
      this.apiKey = null;
      return;
    }

    if (process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      console.log('⚠️  Please replace the placeholder Gemini API key with your actual key');
      this.apiKey = null;
      return;
    }

    this.apiKey = process.env.GEMINI_API_KEY;
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
            maxOutputTokens: 2000,
            topP: 0.8,
            topK: 40
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Gemini API Error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Gemini API response received');
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Invalid response format from Gemini API');
      }
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