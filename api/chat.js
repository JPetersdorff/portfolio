import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { SYSTEM_PROMPT } from './systemPrompt.js'

const MAX_TOKENS = 300
const REQUEST_TIMEOUT_MS = 15000
const HETZNER_INFERENCE_URL = 'https://inference.hetzner.com/api/v1/chat/completions'
const HETZNER_MODEL = 'Qwen/Qwen3.6-35B-A3B-FP8'

const hasRedisConfig = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
)

const ratelimit = hasRedisConfig
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(20, '1 d'),
      prefix: 'chatbot',
    })
  : null

function isValidBody(body) {
  return (
    body &&
    typeof body.sessionToken === 'string' &&
    body.sessionToken.length > 0 &&
    Array.isArray(body.messages) &&
    body.messages.every(
      (m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string',
    )
  )
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' })
    return
  }

  if (!isValidBody(req.body)) {
    res.status(400).json({ error: 'invalid_request' })
    return
  }

  const { sessionToken, messages } = req.body

  if (ratelimit) {
    const { success } = await ratelimit.limit(sessionToken)
    if (!success) {
      res.status(429).json({ error: 'rate_limited' })
      return
    }
  }

  try {
    const reply = await askHetzner(messages)
    res.status(200).json({ reply })
  } catch (err) {
    console.error('chat upstream error', err)
    res.status(502).json({ error: 'unavailable' })
  }
}

async function askHetzner(messages) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(HETZNER_INFERENCE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.HETZNER_INFERENCE_API_KEY}`,
      },
      body: JSON.stringify({
        model: HETZNER_MODEL,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        max_tokens: MAX_TOKENS,
        temperature: 0.6,
        // Qwen3.6 is a "thinking" model by default — without this it burns the token
        // budget on internal reasoning and cuts off before the actual reply.
        chat_template_kwargs: { enable_thinking: false },
      }),
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(`upstream responded ${response.status}`)
    }

    const data = await response.json()
    const content = data?.choices?.[0]?.message?.content
    if (typeof content !== 'string') {
      throw new Error('upstream response missing message content')
    }
    return content
  } finally {
    clearTimeout(timeout)
  }
}
