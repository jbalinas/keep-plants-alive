# 🌿 Keep Plants Alive

> A production-quality plant watering tracker — never forget to water again.

## Features

- 📋 **Plant CRUD** — add, edit, and delete plants with rich metadata
- 💧 **Dashboard** — see which plants are due or overdue at a glance
- 🕐 **Watering history** — full event log per plant
- 📦 **Local-first** — all data in `localStorage`, works offline
- 🔄 **Import / Export** — JSON backup with schema migration
- ♿ **Accessible** — keyboard navigation, ARIA labels, focus management

## Tech Stack

| Layer     | Choice                  | Why                                       |
|-----------|-------------------------|-------------------------------------------|
| Framework | React 18 + TypeScript   | Industry standard, strong typing          |
| Bundler   | Vite 5                  | Fast DX, excellent GH Pages support       |
| Routing   | react-router-dom v6     | Mature, lightweight                       |
| Date math | date-fns                | Tree-shakeable, no side effects           |
| State     | Context + useReducer    | Sufficient for local-first; no extra deps |
| Styling   | CSS Modules             | Zero runtime, scoped, maintainable        |
| Testing   | Vitest                  | Vite-native, Jest-compatible API          |
| Deploy    | GitHub Pages + gh-pages | Free static hosting, zero config          |

## Architecture

```
src/
├── domain/        # Pure functions + types (no React, no side effects)
│   ├── types.ts           — Plant, WateringEvent, AppState, enums
│   └── scheduling.ts      — Due/overdue calculation, sorting, labels
├── storage/       # Persistence layer
│   ├── adapter.ts         — localStorage read/write, import/export
│   └── migrations.ts      — Versioned schema + migration runner
├── store/         # React state management
│   ├── reducer.ts         — Pure reducer for all plant actions
│   └── PlantContext.tsx   — Context provider + usePlantStore hook
├── ui/            # Reusable components
│   └── components/        — PlantCard, Badge, WaterButton, Nav...
└── pages/         # Route-level components
    — Dashboard, PlantList, PlantDetail, EditPlant, AddPlant
```

## Local Development

```bash
# Install
npm install

# Develop
npm run dev          # http://localhost:5173

# Test
npm test             # Run unit tests once
npm run test:watch   # Watch mode

# Lint
npm run lint

# Build & preview
npm run build
npm run preview
```

## Deployment to GitHub Pages

### Automatic (CI)
Every push to `main` runs lint → test → deploy via GitHub Actions.

### Manual
```bash
# Edit vite.config.ts: set BASE to '/your-repo-name/'
npm run deploy
```

Then in GitHub → Settings → Pages → Source: `gh-pages` branch, `/ (root)`.

## Schema & Migrations

`localStorage` key: `keep-plants-alive:v1`

The schema version is stored in the JSON blob. The migration runner in
`src/storage/migrations.ts` applies all necessary migrations when loading
stale data. To add a migration: bump `CURRENT_SCHEMA_VERSION`, add a `case`
to the switch, and add a test.

## Future Work

- [ ] PWA / push notifications for watering reminders
- [ ] Plant photos (File System Access API)
- [ ] Fertilizer tracking
- [ ] Cloud sync (Supabase)
- [ ] Bulk watering ("water all due plants")
- [ ] Statistics (adherence streaks)
