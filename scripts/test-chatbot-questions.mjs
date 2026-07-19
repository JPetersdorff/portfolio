// Feeds test-chatbot-questions.md (same folder) through the real api/chat.js
// handler (same validation, rate-limit check, and Hetzner call the deployed
// endpoint uses) and dumps every question/answer pair to test-chatbot-results
// .md + .json alongside this script (gitignored).
//
// Usage:
//   node --env-file=.env.local scripts/test-chatbot-questions.mjs
//   node --env-file=.env.local scripts/test-chatbot-questions.mjs --limit=10
//   node --env-file=.env.local scripts/test-chatbot-questions.mjs --concurrency=8

import { randomUUID } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import handler from '../api/chat.js'

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url))
const QUESTIONS_FILE = path.join(SCRIPT_DIR, 'test-chatbot-questions.md')
const OUTPUT_MD = path.join(SCRIPT_DIR, 'test-chatbot-results.md')
const OUTPUT_JSON = path.join(SCRIPT_DIR, 'test-chatbot-results.json')

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, value] = arg.replace(/^--/, '').split('=')
    return [key, value ?? true]
  }),
)
const CONCURRENCY = Number(args.concurrency) || 4
const DELAY_MS = Number(args.delayMs) || 0
const LIMIT = args.limit ? Number(args.limit) : Infinity

function parseQuestions(markdown) {
  let category = 'Uncategorized'
  const items = []
  for (const line of markdown.split('\n')) {
    const heading = line.match(/^##\s+(.*)/)
    if (heading) {
      category = heading[1].trim()
      continue
    }
    const item = line.match(/^- \[[ x]\]\s+(.*)/)
    if (item) items.push({ category, question: item[1].trim() })
  }
  return items
}

function callChat(question) {
  return new Promise((resolve) => {
    const req = {
      method: 'POST',
      body: {
        sessionToken: randomUUID(),
        messages: [{ role: 'user', content: question }],
      },
    }
    const res = {
      _status: 200,
      status(code) {
        this._status = code
        return this
      },
      json(payload) {
        resolve({ status: this._status, payload })
      },
    }
    handler(req, res).catch((err) => resolve({ status: 500, payload: { error: String(err) } }))
  })
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function runPool(items, worker, concurrency, delayMs = 0) {
  const results = new Array(items.length)
  let next = 0
  async function lane() {
    while (next < items.length) {
      const i = next++
      if (delayMs) await sleep(delayMs)
      results[i] = await worker(items[i], i)
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, lane))
  return results
}

async function main() {
  if (!process.env.HETZNER_INFERENCE_API_KEY) {
    console.error(
      'HETZNER_INFERENCE_API_KEY is not set. Run with: node --env-file=.env.local scripts/test-chatbot-questions.mjs',
    )
    process.exit(1)
  }

  const markdown = await readFile(QUESTIONS_FILE, 'utf8')
  const items = parseQuestions(markdown).slice(0, LIMIT)
  console.log(`Testing ${items.length} question(s) with concurrency ${CONCURRENCY}...\n`)

  let done = 0
  const results = await runPool(
    items,
    async (item) => {
      const start = Date.now()
      const { status, payload } = await callChat(item.question)
      const ms = Date.now() - start
      done += 1
      const ok = status === 200 && typeof payload?.reply === 'string'
      console.log(
        `[${done}/${items.length}] ${ok ? 'OK  ' : 'FAIL'} (${ms}ms) ${item.question.slice(0, 70)}`,
      )
      return {
        ...item,
        status,
        reply: ok ? payload.reply : null,
        error: ok ? null : (payload?.error ?? 'unknown_error'),
        ms,
      }
    },
    CONCURRENCY,
    DELAY_MS,
  )

  const failures = results.filter((r) => r.error)
  console.log(`\nDone. ${results.length - failures.length}/${results.length} succeeded.`)
  if (failures.length) {
    console.log(`Failures:`)
    for (const f of failures) console.log(`  - ${f.question} -> ${f.error}`)
  }

  await writeFile(OUTPUT_JSON, JSON.stringify(results, null, 2))

  const byCategory = new Map()
  for (const r of results) {
    if (!byCategory.has(r.category)) byCategory.set(r.category, [])
    byCategory.get(r.category).push(r)
  }
  let md = `# Chatbot Test Results\n\n${results.length - failures.length}/${results.length} questions answered successfully.\n\n`
  for (const [category, rows] of byCategory) {
    md += `## ${category}\n\n`
    for (const r of rows) {
      md += `**Q: ${r.question}**\n\n`
      md += r.reply ? `${r.reply}\n\n` : `_ERROR: ${r.error}_\n\n`
    }
  }
  await writeFile(OUTPUT_MD, md)
  console.log(`\nWrote ${path.relative(ROOT, OUTPUT_MD)} and ${path.relative(ROOT, OUTPUT_JSON)}`)
}

main()
