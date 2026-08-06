// xAI Grok client. The API is OpenAI-compatible: POST /v1/chat/completions
// with a Bearer token, and the reply arrives as choices[0].message.content.

const API_URL = process.env.XAI_API_BASE_URL || 'https://api.x.ai/v1';

// Override with GROK_MODEL. List what your key can reach with:
//   curl https://api.x.ai/v1/models -H "Authorization: Bearer $XAI_API_KEY"
const DEFAULT_MODEL = 'grok-3';

class GrokService {
  constructor() {
    // Trim whitespace and strip surrounding quotes. A key pasted with a
    // trailing newline, or wrapped in quotes in the .env file, produces a
    // malformed Authorization header and a confusing 401 that never mentions
    // the key itself.
    const raw = (process.env.XAI_API_KEY || '').trim().replace(/^["']|["']$/g, '');

    this.model = (process.env.GROK_MODEL || DEFAULT_MODEL).trim();

    if (!raw) {
      console.log('⚠️  Grok API key not provided. Add XAI_API_KEY to backend/.env');
      this.apiKey = null;
      return;
    }

    if (raw === 'your_xai_api_key_here') {
      console.log('⚠️  Please replace the placeholder Grok API key with your actual key');
      this.apiKey = null;
      return;
    }

    // xAI keys are prefixed "xai-". Warn rather than refuse, in case the
    // format changes.
    if (!raw.startsWith('xai-')) {
      console.warn(
        `⚠️  XAI_API_KEY does not look like an xAI key (expected "xai-…", got "${raw.slice(0, 6)}…" of length ${raw.length}). ` +
          'Create one at https://console.x.ai'
      );
    }

    this.apiKey = raw;
    console.log(`✅ Grok service initialized (model: ${this.model})`);
  }

  /** True when a usable (non-placeholder) key is present. Drives /health. */
  get isConfigured() {
    return !!this.apiKey;
  }

  async generateCode(prompt) {
    if (!this.apiKey) {
      throw new Error('Grok API key not configured. Please add XAI_API_KEY to backend/.env file.');
    }

    try {
      console.log(`🤖 Calling Grok API (${this.model})...`);

      const systemPrompt =
        'You are an expert full-stack developer. Generate clean, production-ready code based on the ' +
        "user's requirements. Include proper error handling, comments, and follow best practices. " +
        'Provide complete, working code that can be used immediately.';

      const response = await fetch(`${API_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 8192,
          stream: false
        })
      });

      if (!response.ok) {
        // A non-JSON error body (gateway HTML, empty 502) would make .json()
        // throw and mask the real status code.
        const errorData = await response.json().catch(() => ({}));
        const detail =
          errorData.error?.message || errorData.error || errorData.msg || response.statusText;
        throw new Error(`Grok API Error (${response.status}): ${detail}`);
      }

      const data = await response.json();
      console.log('✅ Grok API response received');

      const choice = data.choices?.[0];
      const text = choice?.message?.content;

      if (!text) {
        throw new Error(
          choice?.finish_reason
            ? `Grok returned no code (finish_reason: ${choice.finish_reason}).`
            : 'Invalid response format from Grok API'
        );
      }

      if (choice.finish_reason === 'length') {
        console.warn('⚠️  Grok response hit the output token limit and may be truncated');
      }

      return text;
    } catch (error) {
      console.error('❌ Grok API Error:', error.message);
      throw error instanceof Error ? error : new Error(`Grok API Error: ${error}`);
    }
  }
}

module.exports = new GrokService();
