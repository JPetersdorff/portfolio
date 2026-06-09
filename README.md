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
```
