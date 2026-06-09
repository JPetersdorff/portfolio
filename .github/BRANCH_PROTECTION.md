# GitHub Branch Protection Setup

Once the repo is pushed to GitHub, configure branch protection for `main` and `develop`:

## Settings → Branches → Add rule

Apply these settings for **both** `main` and `develop`:

| Setting | Value |
|---------|-------|
| Branch name pattern | `main` / `develop` |
| Require a pull request before merging | ✅ |
| Require approvals | optional (solo project → 0) |
| Do not allow bypassing the above settings | ✅ |
| Restrict who can push to matching branches | optional |
| Allow force pushes | ❌ |
| Allow deletions | ❌ |

The local `pre-push` hook in `.githooks/` already blocks accidental direct pushes from your machine. GitHub branch protection is the server-side enforcement.

## Activate hooks locally

After cloning, run once:

```bash
git config core.hooksPath .githooks
```

This is already set in `.git/config` after the initial repo setup, but any new collaborator needs to run it.
