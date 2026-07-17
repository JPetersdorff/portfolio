import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

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

  res.status(501).json({ error: 'unavailable' })
}
