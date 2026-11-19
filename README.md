# FoxTrack — Phase 1

FoxTrack is a minimalist, modern, offline-first Todo List application inspired by the simplicity and usability of apps like TickTick, built with a mobile-first philosophy.

---

## 🚀 Key Features (Phase 1)

- **Offline-First Storage**: Powered by **Dexie.js** and **IndexedDB**. All task creation, editing, status toggles, priority adjustments, and deletions persist locally with zero server dependence.
- **Instant Task Creation**: Quick keyboard-driven workflow — type your task and press `Enter` to create immediately.
- **Priority Management**: 3 distinct priority levels (`Low`, `Medium`, `High`) with clean visual indicators.
- **Due Date Handling**: Optional due dates with human-friendly labels (`Today`, `Tomorrow`, `Nov 25`), overdue visual alerts, and full local timezone awareness.
- **Sensible Default Sorting**:
  1. Active tasks before completed tasks
  2. Higher-priority before lower-priority
  3. Earlier due dates first
  4. Newest created first
- **Live Reactive UI**: Uses Dexie's `useLiveQuery` to reactively reflect all database updates immediately without state duplication.
- **Themes**: Seamless Light mode and Dark mode support with persistent user preference.
- **PWA & Offline Shell**: Service Worker precaches the application shell and static assets, allowing the app to launch, reload, and function completely offline.
- **Android Ready**: Configured with **Capacitor** to run the bundled local web assets natively on Android devices.

---

## 🛠️ Technology Stack

- **Framework**: Next.js (App Router, Static Export `output: 'export'`)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Local Database**: Dexie.js (IndexedDB)
- **Validation**: Zod
- **Date Handling**: date-fns
- **PWA**: Custom Service Worker + Web App Manifest
- **Mobile Engine**: Capacitor (Android)
- **Testing**: Vitest + React Testing Library + fake-indexeddb
- **Package Manager**: pnpm

---

## 📦 Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm (v9+)

### Installation

```bash
pnpm install
```

### Development Server

Run the local development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 🧪 Testing

FoxTrack includes automated test suites covering:

1. **Dexie CRUD & Sorting Operations**: Full verification of task creation, updating, completion toggling, deletion, and priority/due date sorting.
2. **Offline Persistence & Browser Restarts**: Simulates app closes and re-openings to ensure zero data loss.
3. **Reactive UI Flows**: Tests user interactions (typing, keyboard Enter, priority toggle, editing, deleting, filtering).
4. **Service Worker & PWA Manifest**: Verifies cache policies, offline navigation fallback, and PWA assets.
5. **Date Utils**: Verifies local timezone conversion, relative labels, and overdue status detection.

Run all tests:

```bash
pnpm test
```

Or watch mode:

```bash
pnpm test:watch
```

---

## 🏗️ Production Build & Static Export

Generate the optimized static HTML/CSS/JS export in the `out/` directory:

```bash
pnpm build
```

The output will be placed in `out/`, ready for static hosting or Capacitor native bundling.

---

## 📱 Android (Capacitor) Setup & Build

FoxTrack is pre-configured with Capacitor to run natively on Android using locally bundled resources (`webDir: 'out'`).

### Prerequisites for Android

- Android Studio
- Android SDK & Build Tools

### Sync Web Assets to Android

Whenever you update the web app and run `pnpm build`, sync the assets:

```bash
pnpm build
pnpm cap:sync
```

### Open in Android Studio

```bash
pnpm cap:open:android
```

From Android Studio:

1. Wait for Gradle sync to complete.
2. Select an emulator or connected physical Android device.
3. Click **Run** (`Shift + F10`) to launch FoxTrack natively.

---

## 🗄️ Database Architecture

FoxTrack uses Dexie.js to interface with IndexedDB:

- **Database Name**: `FoxTrackDB`
- **Table**: `tasks`
- **Indexes**: `id, completed, priority, dueDate, createdAt, updatedAt`

### Schema Definition

```typescript
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string; // UUID v4
  title: string; // Trimmed task title
  completed: boolean; // Task completion status
  priority: TaskPriority; // "low" | "medium" | "high"
  dueDate: number | null; // Unix timestamp in milliseconds or null
  createdAt: number; // Creation timestamp (ms)
  updatedAt: number; // Last modified timestamp (ms)
}
```

---

## 🌐 Offline-First Architecture

1. **Local Source of Truth**: All operations (Read/Write/Delete) hit IndexedDB directly. There are no remote API calls required for core functionality.
2. **Service Worker (`public/sw.js`)**:
   - Pre-caches `index.html`, `manifest.json`, and app icons upon installation.
   - Intercepts navigation requests: when offline, immediately serves cached `index.html`.
   - Uses Stale-While-Revalidate caching for static scripts, CSS chunks, and assets.
3. **No Network Failure Blocker**: You can disconnect your network completely; the app continues to create, edit, sort, and persist tasks seamlessly.
