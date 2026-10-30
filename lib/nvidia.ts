// ============================================================
// NVIDIA API wrapper (google/gemma-4-31b-it)
// Replaces Gemini SDK — same structured outputs, same prompt patterns
// ============================================================

const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const MODEL = 'google/gemma-4-31b-it';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface NvidiaResponse {
  choices: Array<{
    message: { content: string };
    finish_reason: string;
  }>;
}

// ── Core completion (non-streaming) ──────────────────────────────────────────

export async function complete(
  messages: Message[],
  opts: {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
  } = {}
): Promise<string> {
  const apiKey = process.env.NVIDIA_API_KEY?.trim();
  if (!apiKey) throw new Error('NVIDIA_API_KEY is not set');

  const res = await fetch(NVIDIA_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    signal: AbortSignal.timeout(8000),
    body: JSON.stringify({
      model: MODEL,
      max_tokens: opts.maxTokens ?? 2048,
      stream: false,
      temperature: opts.temperature ?? 0.5,
      top_p: opts.topP ?? 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      messages,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`NVIDIA API error ${res.status}: ${err}`);
  }

  const data = (await res.json()) as NvidiaResponse;
  return data.choices[0]?.message?.content ?? '';
}

// ── Streaming completion ──────────────────────────────────────────────────────

export async function* stream(
  messages: Message[],
  opts: { temperature?: number; maxTokens?: number } = {}
): AsyncGenerator<string> {
  const apiKey = process.env.NVIDIA_API_KEY?.trim();
  if (!apiKey) throw new Error('NVIDIA_API_KEY is not set');

  const res = await fetch(NVIDIA_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
    },
    signal: AbortSignal.timeout(10000),
    body: JSON.stringify({
      model: MODEL,
      max_tokens: opts.maxTokens ?? 4096,
      stream: true,
      temperature: opts.temperature ?? 0.5,
      top_p: 1,
      messages,
    }),
  });

  if (!res.ok || !res.body) {
    const err = await res.text();
    throw new Error(`NVIDIA API stream error ${res.status}: ${err}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6).trim();
      if (data === '[DONE]') return;
      try {
        const json = JSON.parse(data);
        const delta = json.choices?.[0]?.delta?.content;
        if (delta) yield delta;
      } catch {
        // skip malformed chunks
      }
    }
  }
}

// ── Prompt Templates ──────────────────────────────────────────────────────────

export const PROMPTS = {
  planner: (query: string) => ({
    system: `You are a research planning agent. Break down user queries into focused sub-queries for parallel research. Return a JSON array of 3-6 sub-query strings only.`,
    user: `Research query: "${query}"\n\nReturn a JSON array of sub-queries. Example: ["sub-query 1", "sub-query 2"]`,
  }),

  synthesizer: (
    query: string,
    sources: string,
    depth: 'quick' | 'deep'
  ) => ({
    system: `You are a world-class research synthesizer. Write comprehensive, accurate research reports with strict inline citations like [1], [2]. Structure the report with clear headings. ${depth === 'deep' ? 'Provide extensive analysis.' : 'Be concise but complete.'}`,
    user: `Query: "${query}"\n\nSources:\n${sources}\n\nWrite a structured Markdown research report with inline citations.`,
  }),

  videoScript: (query: string, report: string) => ({
    system: `You are a documentary script writer. Create engaging 60-90 second explainer scripts with 5-7 scene markers. Return valid JSON only.`,
    user: `Topic: "${query}"\n\nResearch Summary:\n${report.slice(0, 2000)}\n\nReturn a JSON object: { "topic": string, "totalDuration": number, "scenes": [{ "id": string, "title": string, "narration": string, "onScreenCue": string, "duration": number }] }`,
  }),

  followUp: (query: string, context: string, question: string) => ({
    system: `You are Kryton, an AI research assistant. Answer follow-up questions about research using the provided context. Be precise and cite from context where possible.`,
    user: `Research topic: "${query}"\n\nContext:\n${context.slice(0, 3000)}\n\nQuestion: ${question}`,
  }),

  relatedQueries: (query: string) => ({
    system: `Generate 3-5 related research queries that would deepen understanding of the topic. Return a JSON array of strings.`,
    user: `Topic: "${query}"\n\nReturn a JSON array of related research queries.`,
  }),
};
