---
type: Process Artifact
title: Tooling And Deploy Source Map
description: Ingest summary for package scripts, Vite/Vitest/PWA config, GitHub Pages deploy, and harness tooling.
resource: package.json
tags: [sources, tooling, deploy, pwa, github-pages]
timestamp: 2026-06-15T21:30:00+03:00
---

# Package Scripts

`package.json` defines the working commands:

* `npm run dev` - Vite dev server.
* `npm run build` - `tsc -b` then `vite build`.
* `npm run type-check` - TypeScript without emit.
* `npm run lint` - ESLint over configured source files.
* `npm run test` - Vitest run.
* `npm run preview` - Vite preview.

# App Platform

The app is a Vite React TypeScript PWA:

* `vite.config.ts` uses React and Tailwind plugins.
* The deployed base path is `/tratament-copii/`.
* `manifest.json` declares the Romanian PWA metadata and icon paths.
* `sw.js` is a network-first service worker with cache fallback.
* `src/main.tsx` registers `sw.js` in production.
* The custom Vite `sw-cache-version` plugin mutates `sw.js` after build so the cache name tracks the built JS hash and copies the service worker, manifest, and root icons into `dist/` for GitHub Pages.
* The production manifest is served from `/tratament-copii/manifest.json` so
  `start_url`, `scope`, and icon URLs resolve at the app root rather than under
  hashed asset paths.

# Deployment

`.github/workflows/deploy.yml` deploys `main` to GitHub Pages:

* Node 22
* `npm ci`
* `npm run build`
* upload `dist`
* deploy through `actions/deploy-pages@v4`

# Verification Harness

`scripts/verify-plan.sh` is the mechanical harness checker. It verifies branch
and remote SHA state, runs `npm run type-check`, `npm run test`, and
`npm run build`, then reports findings or a mechanical pass.

`.claude/agents/*.md` encode the older implementer, agent-reviewer, and
design-reviewer roles. They are useful as historical process context, but the
current branch naming policy is [Version and phase branch naming](../process/version-phase-branch-naming.md).

# Citations

* `package.json`
* `vite.config.ts`
* `src/main.tsx`
* `vitest.config.ts`
* `eslint.config.js`
* `manifest.json`
* `sw.js`
* `.github/workflows/deploy.yml`
* `scripts/verify-plan.sh`
* `.claude/agents/*.md`
