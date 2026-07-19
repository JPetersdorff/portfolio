#!/usr/bin/env node
// Minimal local host for the real api/chat.js Vercel handler, so the red-team
// harness can hit it without `vercel dev`. Run with the project env loaded:
//   node --env-file=.env.local scripts/red-team/dev-server.mjs
// Every request is routed to the chat handler (path is ignored).
import http from 'node:http'
import handler from '../../api/chat.js'

const PORT = Number(process.env.PORT || 8787)

const server = http.createServer(async (req, res) => {
  let raw = ''
  for await (const chunk of req) raw += chunk
  try {
    req.body = raw ? JSON.parse(raw) : undefined
  } catch {
    req.body = undefined
  }
  // Vercel-style response shims the handler expects.
  res.status = (code) => {
    res.statusCode = code
    return res
  }
  res.json = (obj) => {
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify(obj))
  }
  try {
    await handler(req, res)
  } catch (err) {
    console.error('handler threw', err)
    if (!res.headersSent) res.status(500).json({ error: 'shim_error' })
  }
})

server.listen(PORT, () => {
  console.log(`red-team dev-server: http://localhost:${PORT}/api/chat`)
})
