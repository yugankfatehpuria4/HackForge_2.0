// Chat-completions client for OpenAI-compatible providers.
//
// Groq and xAI both expose the same POST /chat/completions shape, so one
// client covers both. The provider is inferred from the key prefix, which
// removes an easy footgun: "Groq" (groq.com, gsk_… keys, open models) and
// "Grok" (x.ai, xai-… keys) are different companies with near-identical names,
// and pointing one key at the other's endpoint just returns "Bad credentials".

const PROVIDERS = {
  groq: {
    label: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    defaultModel: 'llama-3.3-70b-versatile',
    keyPrefix: 'gsk_',
    console: 'https://console.groq.com/keys'
  },
  xai: {
    label: 'xAI Grok',
    baseUrl: 'https://api.x.ai/v1',
    defaultModel: 'grok-3',
    keyPrefix: 'xai-',
    console: 'https://console.x.ai'
  }
};

const PLACEHOLDERS = new Set([
  'your_api_key_here',
  'your_xai_api_key_here',
  'your_groq_api_key_here',
  'your_gemini_api_key_here'
]);

/** First key found, in priority order, trimmed and unquoted. */
function readKey() {
  const raw =
    process.env.AI_API_KEY ||
    process.env.GROQ_API_KEY ||
    process.env.XAI_API_KEY ||
    '';
  return raw.trim().replace(/^["']|["']$/g, '');
}

/** Explicit AI_PROVIDER wins; otherwise infer from the key prefix. */
function detectProvider(key) {
  const explicit = (process.env.AI_PROVIDER || '').trim().toLowerCase();
  if (PROVIDERS[explicit]) return explicit;

  if (key.startsWith(PROVIDERS.groq.keyPrefix)) return 'groq';
  if (key.startsWith(PROVIDERS.xai.keyPrefix)) return 'xai';

  return 'groq';
}

class AIService {
  constructor() {
    const key = readKey();
    const providerName = detectProvider(key);
    const provider = PROVIDERS[providerName];

    this.provider = providerName;
    this.providerLabel = provider.label;
    this.baseUrl = (process.env.AI_API_BASE_URL || provider.baseUrl).replace(/\/$/, '');
    this.model = (process.env.AI_MODEL || process.env.GROK_MODEL || provider.defaultModel).trim();

    if (!key) {
      console.log('⚠️  AI API key not provided. Add GROQ_API_KEY (or XAI_API_KEY) to backend/.env');
      this.apiKey = null;
      return;
    }

    if (PLACEHOLDERS.has(key)) {
      console.log('⚠️  Please replace the placeholder AI API key with your actual key');
      this.apiKey = null;
      return;
    }

    // Warn on a key that matches neither known prefix — usually a key from a
    // different provider entirely.
    if (!key.startsWith(PROVIDERS.groq.keyPrefix) && !key.startsWith(PROVIDERS.xai.keyPrefix)) {
      console.warn(
        `⚠️  API key does not look like a Groq ("gsk_…") or xAI ("xai-…") key ` +
          `(got "${key.slice(0, 6)}…", length ${key.length}). Assuming ${provider.label}.`
      );
    }

    this.apiKey = key;
    console.log(`✅ AI service initialized (${provider.label}, model: ${this.model})`);
  }

  /** True when a usable (non-placeholder) key is present. Drives /health. */
  get isConfigured() {
    return !!this.apiKey;
  }

  async generateCode(prompt) {
    if (!this.apiKey) {
      throw new Error(
        'AI API key not configured. Please add GROQ_API_KEY (or XAI_API_KEY) to backend/.env file.'
      );
    }

    try {
      console.log(`🤖 Calling ${this.providerLabel} API (${this.model})...`);

      const systemPrompt =
        'You are an expert full-stack developer. Generate clean, production-ready code based on the ' +
        "user's requirements. Include proper error handling, comments, and follow best practices. " +
        'Provide complete, working code that can be used immediately.';

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
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
        throw new Error(`${this.providerLabel} API Error (${response.status}): ${detail}`);
      }

      const data = await response.json();
      console.log(`✅ ${this.providerLabel} API response received`);

      const choice = data.choices?.[0];
      const text = choice?.message?.content;

      if (!text) {
        throw new Error(
          choice?.finish_reason
            ? `${this.providerLabel} returned no code (finish_reason: ${choice.finish_reason}).`
            : `Invalid response format from the ${this.providerLabel} API`
        );
      }

      if (choice.finish_reason === 'length') {
        console.warn('⚠️  Response hit the output token limit and may be truncated');
      }

      return text;
    } catch (error) {
      console.error(`❌ ${this.providerLabel} API Error:`, error.message);
      throw error instanceof Error ? error : new Error(String(error));
    }
  }
}

module.exports = new AIService();
module.exports.PROVIDERS = PROVIDERS;
