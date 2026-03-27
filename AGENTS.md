# Operational Learnings

Project-specific guidance for Ralph. Start minimal — add entries only when Ralph exhibits repeated failures.

## Build/Test Commands

```bash
npm install          # install dependencies
npm run build        # TypeScript compile + Vite build (required to pass before commit)
npm run type-check   # TypeScript type check only (faster)
npm run dev          # dev server
```

## Project Conventions

- All UI text must be in **Romanian**
- Use **Tailwind CSS** for all styling — no inline styles, no CSS modules
- Use **lucide-react** for icons
- Use **shadcn/ui** component patterns (Card, Button, Input, Badge, Dialog, Tabs) implemented with Tailwind
- State management: React `useState` + `useReducer` — no external state library needed
- Persistence: `localStorage` only — no backend
- Component files: `src/components/ComponentName.tsx`
- Type definitions: `src/types/index.ts`
- Utility functions: `src/lib/utils.ts` (dose calc), `src/lib/storage.ts` (localStorage)

## Known Constraints

- No tests directory yet — focus on making `npm run build` and `npm run type-check` pass
- The `tsconfig.app.json` has `noUnusedLocals` and `noUnusedParameters` set to true — don't leave unused imports/vars
