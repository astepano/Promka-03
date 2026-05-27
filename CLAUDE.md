# Молекула Бизнеса — CLAUDE.md

Claude Code guidance for the **molecule-business** repository.

## Project overview

"Молекула Бизнеса" (Business Molecule) is a 3D interactive business-graph
visualization built with React 19 and Three.js. It renders companies, budgets,
projects, managers, resources, contractors, accounts, and satellite nodes as
coloured 3D spheres connected by weighted animated edges that represent
financial flows. A timeline slider and scenario picker drive re-fetching and
re-rendering of the graph.

The app is Russian-language throughout (UI labels, variable names in mocks,
markdown content).

---

## Tech stack

| Layer | Library / tool |
|---|---|
| UI framework | React 19 (`react`, `react-dom`) |
| Build tool | Vite 6 (`@vitejs/plugin-react`) |
| 3-D graph | `react-force-graph-3d` → `three`, `three-spritetext` |
| UI components | Ant Design 6 (dark theme, `ruRU` locale) |
| State | Zustand 5 |
| HTTP client | axios |
| Markdown | `react-markdown` + `remark-gfm` |
| Language | JavaScript (ESM, `.jsx`) — no TypeScript |

---

## Repository layout

```
/
├── index.html               # HTML shell (title "Молекула Бизнеса", lang="ru")
├── vite.config.js           # Vite config — port 3001, host 0.0.0.0
├── package.json             # name: molecule-business
├── src/
│   ├── main.jsx             # Entry — mounts App inside AntD ConfigProvider
│   ├── App.jsx              # Root layout + ErrorBoundary class component
│   ├── App.css              # Global reset; full-viewport dark (#000) layout
│   ├── api/
│   │   └── moleculeApi.js   # axios client; falls back to mocks when VITE_API_URL unset
│   ├── mocks/
│   │   └── graphData.js     # Static mock nodes/links + NODE_DETAILS map
│   ├── store/
│   │   └── useMoleculeStore.js  # Single Zustand store for all app state
│   ├── hooks/
│   │   └── useGraphData.js  # Fetches graph on date/scenario change; writes to store
│   ├── utils/
│   │   └── graphHelpers.js  # Three.js object factories + colour/width helpers
│   └── components/
│       ├── MoleculeGraph/   # ForceGraph3D canvas, handles node clicks & zoom
│       ├── SideMenu/        # Left-side drawer (Finance / Data tabs)
│       ├── NodeDetailPanel/ # Right-side drawer — markdown from API on node click
│       ├── TimelineSlider/  # Bottom bar — date slider + scenario radio group
│       └── HelpButton/      # ? button with usage modal
```

Each component directory contains exactly one `.jsx` and one `.css` file named
after the component (e.g. `MoleculeGraph/MoleculeGraph.jsx`).

---

## Architecture — three layers

```
┌──────────── UI Layer ─────────────┐
│  MoleculeGraph  SideMenu          │
│  NodeDetailPanel  TimelineSlider  │
│  HelpButton                       │
└──────────────────┬────────────────┘
                   │ reads/writes
┌──────────── Logic Layer ──────────┐
│  useMoleculeStore (Zustand)       │
│  useGraphData (hook)              │
│  graphHelpers (Three.js utils)    │
└──────────────────┬────────────────┘
                   │ fetches
┌──────────── Data Layer ───────────┐
│  moleculeApi.js (axios)           │
│  graphData.js (mocks)             │
└───────────────────────────────────┘
```

### Data flow

1. `TimelineSlider` writes `currentDate` / `scenario` to the store.
2. `useGraphData` (called inside `MoleculeGraph`) reacts to store changes,
   calls `getGraph(date, scenario)`, writes `nodes` + `links` back to store.
3. `MoleculeGraph` reads `nodes` + `links` from the store, passes them to
   `ForceGraph3D`.
4. Clicking a node calls `setSelectedNode` → `NodeDetailPanel` opens and
   calls `getNodeDetail(id)` → renders markdown.

---

## State — `useMoleculeStore`

Single Zustand store (`src/store/useMoleculeStore.js`). Key slices:

```js
// Graph data
nodes: []          // ForceGraph3D node objects
links: []          // ForceGraph3D link objects
loading: false
error: null

// Timeline
currentDate: '2026-04-01'   // ISO date string
scenario: 'optimistic'      // 'pessimistic' | 'neutral' | 'optimistic'

// UI panels
sideMenuOpen: false
detailPanelOpen: false
activeMenuTab: 'finance'    // 'finance' | 'data'
selectedNode: null
```

Actions: `setGraphData`, `setSelectedNode`, `closeDetailPanel`, `setLoading`,
`setError`, `setDate`, `setScenario`, `toggleSideMenu`, `setActiveMenuTab`.

---

## API layer

`src/api/moleculeApi.js` exposes two functions:

| Function | Endpoint | Fallback |
|---|---|---|
| `getGraph(date, scenario)` | `GET /api/graph?date=&scenario=` | `getMockGraph()` |
| `getNodeDetail(id)` | `GET /api/nodes/:id` | `NODE_DETAILS[id]` map |

The fallback activates when `VITE_API_URL` env var is **not set**. For
local development no env var is needed — mocks are used automatically.

To connect a real backend set:
```
VITE_API_URL=https://your-api.example.com
```

### Mock data shape

`getMockGraph(date, scenario)` returns `{ nodes, links }` where:

- **node**: `{ id, label, type, val, color }` — `val` controls sphere radius
- **link**: `{ source, target, value, label }` — `value` controls edge width
  and particle speed

Financial values are scaled by `scenarioMultiplier × dateMultiplier`.
DateMultiplier grows linearly from 0.5 (Dec 2025) to 1.2 (Apr 2026).
Scenario multipliers: pessimistic 0.6 × | neutral 1.0 × | optimistic 1.4 ×.

### Node types and colours

| type | colour |
|---|---|
| `company` | `#2d9c2d` (dark green) |
| `budget` | `#3ab83a` (green) |
| `project` | `#e07b00` (orange) |
| `manager` | `#c97fd4` (purple) |
| `resource` | `#cc2a2a` (red) |
| `contractor` | `#8b6b5a` (brown) |
| `account` | `#7b5fc0` (violet) |
| `satellite` | `#f5c518` (yellow) |

---

## Three.js / graph rendering

All Three.js helpers live in `src/utils/graphHelpers.js`:

- **`makeNodeObject(node)`** — returns `THREE.Group` containing a
  `THREE.Mesh` (`SphereGeometry` + `MeshBasicMaterial`) and an optional
  `SpriteText` label. Uses `MeshBasicMaterial` (not Lambert/Phong) because
  the scene has no light sources.
- **`makeLinkLabel(link)`** — returns a `SpriteText` for links with a label,
  or an empty `THREE.Group` when there is no label. **Must never return
  `null`** — that crashes `linkThreeObject`.
- **`calcLinkWidth(value, maxValue)`** — maps value to range [0.5, 8].
- **`getLinkColor(value, maxValue)`** — returns an `rgba()` string; higher
  ratio → darker, more opaque.
- **`getMaxLinkValue(links)`** — finds max `link.value`, minimum 1.

`MoleculeGraph.jsx` wraps all callbacks in `useCallback` to prevent
unnecessary ForceGraph3D re-renders. Node radius is stored on `node.__radius`
by `makeNodeObject` for downstream use.

---

## Development workflow

### Start dev server
```bash
npm install
npm run dev
# → http://localhost:3001  (also accessible on 0.0.0.0 for remote envs)
```

### Build
```bash
npm run build    # outputs to dist/
npm run preview  # preview the production build
```

### No test suite
There are currently no automated tests. Verify changes by running the dev
server and interacting with the graph manually.

---

## Code conventions

- **JavaScript only** — no TypeScript. No `tsconfig.json`.
- **ESM throughout** — `"type": "module"` in `package.json`; all imports use
  explicit `.js` / `.jsx` extensions.
- **Default exports** for React components; **named exports** for utilities
  and hooks.
- **Component co-location** — each component in its own directory with a
  matching `.css` file; no shared stylesheet beyond `App.css`.
- **No CSS framework** — plain CSS files, no Tailwind or CSS modules.
  Ant Design provides the component styles.
- **Inline styles** for one-off overrides (e.g. `ErrorBoundary` display);
  CSS classes for component-level layout.
- **Dark theme everywhere** — background `#000`, Ant Design
  `theme.darkAlgorithm`, all custom colours chosen for dark backgrounds.
- **Russian UI** — all visible text, labels, mock markdown, and comments in
  source files are in Russian. Keep this consistent.
- **No comments explaining what code does** — only add a comment when the
  *why* is non-obvious (workarounds, subtle invariants).
- **Commit messages in English** with a `https://claude.ai/code/session_…`
  footer line.
- **`cancelled` flag pattern** in async `useEffect` — always set a local
  boolean and check it before calling state setters to avoid stale-closure
  updates after unmount.

---

## Important pitfalls

1. **`makeLinkLabel` must return a `THREE.Object3D`**, never `null`. The
   ForceGraph3D library passes the return value directly to Three.js and will
   crash with a null.
2. **Use `MeshBasicMaterial`**, not `MeshLambertMaterial` or
   `MeshPhongMaterial`. The scene has no `THREE.Light` — Lambert/Phong
   produce black (invisible) meshes.
3. **Avoid mixing static and dynamic imports** for the same module. Vite
   warns and may bundle incorrectly. `moleculeApi.js` switched from a dynamic
   `import()` to a static `import` of `graphData.js` for this reason.
4. **`VITE_API_URL` controls mock vs real backend** — leaving it unset
   silently uses mocks; setting it to an unreachable URL will surface network
   errors in the UI via the `ErrorBoundary`.
5. **The `ForceGraph3D` `ref`** (`fgRef`) is used for imperative camera
   control (`cameraPosition`). Do not destructure or copy the ref — use
   `fgRef.current` directly.

---

## Branch conventions

Feature branches follow the pattern `claude/<short-description>-<ID>`. The
current development branch for this CLAUDE.md is
`claude/claude-md-docs-1JdQd`.
