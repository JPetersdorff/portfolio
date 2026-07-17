# Jakob von Petersdorff — Portfolio

Personal portfolio website showcasing professional background, projects, and nature photography.

## Tech Stack

- **Framework:** React + Vite
- **Styling:** TBD
- **Deployment:** TBD

## Getting Started

```bash
npm install
npm run dev
```

## Chatbot backend

The floating chat widget (`src/components/ChatWidget.jsx`) talks to `/api/chat.js`, a
Vercel serverless function that proxies requests to the
[Hetzner Experiments Inference API](https://experiments.hetzner.com) (currently free,
rate-limited beta; model: `Qwen/Qwen3.6-35B-A3B-FP8`) — no VM to manage. If Hetzner ever
starts billing this or shuts it down, the fallback is a pay-per-token provider with a
confirmed prepaid hard-cap (e.g. DeepInfra) — swap the endpoint/model/env var in
`api/chat.js`, the request shape is already OpenAI-compatible either way.

Required env vars — see `.env.local.example`:

- `HETZNER_INFERENCE_API_KEY` — token from experiments.hetzner.com (Apps → Inference →
  Create API Token).
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` — Upstash Redis (Vercel
  Marketplace), used for per-session rate limiting (20 messages/day). Optional locally —
  without it, rate limiting is skipped rather than failing requests.

This repo does not include the Hetzner VM provisioning — that's server administration,
not application code.

## Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production — protected, merge via PR only |
| `develop` | Integration — protected, merge via PR only |
| `feature/*` | New features |
| `fix/*` | Bug fixes |
| `chore/*` | Config, deps, tooling |

Direct pushes to `main` and `develop` are blocked. All changes go through pull requests.

## Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add photography gallery
fix: correct nav link on mobile
chore: update dependencies
docs: update README
style: adjust hero spacing
refactor: extract Card component
```

## Project Structure

```
src/
├── components/    # Reusable UI components
├── pages/         # Page-level components
├── assets/        # Images, fonts
└── styles/        # Global styles

api/               # Vercel serverless functions (e.g. chat backend)
```
