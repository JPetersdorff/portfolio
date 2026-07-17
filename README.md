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
Vercel serverless function that proxies requests to a self-hosted Ollama instance
(Llama 3.1 8B) on a Hetzner Cloud VM — not a managed LLM API — so a prepaid cloud
balance is the hard spending cap instead of per-token billing on a card.

Required env vars — see `.env.local.example`:

- `OLLAMA_ENDPOINT_URL` / `OLLAMA_BEARER_TOKEN` — the self-hosted model endpoint, locked
  down at the network level (firewall allowlist + bearer token).
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
