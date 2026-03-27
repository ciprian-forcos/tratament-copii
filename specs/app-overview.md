# App Overview

## What it is
A Romanian-language pediatric medication dosage calculator and treatment schedule planner ("Tratament Copii - Calculator Doze").

## Core purpose
Parents/caregivers enter a child's weight (and optionally height), and the app calculates correct medication doses and generates a treatment schedule showing when to administer each medicine.

## Stack
- React 18 + TypeScript
- Vite build
- Tailwind CSS for styling (use shadcn/ui component patterns: Card, Button, Input, Badge, Dialog, Tabs, etc.)
- lucide-react for icons
- date-fns for date/time formatting
- No backend — all state is client-side, persisted in localStorage

## Pages / Tabs
The app has 3 main tabs:
1. **Program** — the treatment schedule/timeline view
2. **Medicamente** — medication management (add/edit/delete medications)
3. **Copii** — child profile management (add/edit/delete children)

## Language
All UI text is in Romanian.

## PWA
The app should be a Progressive Web App (include manifest.json link and service worker registration).
