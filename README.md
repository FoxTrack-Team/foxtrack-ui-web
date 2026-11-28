<div align="center">

# 🦊 FoxTrack

**A minimalist, offline-first personal productivity app**  
_Tasks · Daily Habits · Gamified Rewards — crafted with Apple Human Interface Guidelines_

![Next.js](https://img.shields.io/badge/Next.js-App%20Router-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Capacitor](https://img.shields.io/badge/Capacitor-Android-119EFF?style=flat-square&logo=capacitor&logoColor=white)
![Dexie](https://img.shields.io/badge/Dexie.js-IndexedDB-orange?style=flat-square)
![Vitest](https://img.shields.io/badge/Vitest-Tested-6E9F18?style=flat-square&logo=vitest&logoColor=white)

</div>

---

## ✨ Key Features

| Module                         | Highlights                                                                                                                                         |
| :----------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| **📋 Tasks & Scheduling**      | Priorities (`Low`, `Medium`, `High`), due dates & **Apple Wheel TimePicker**, overdue alerts, and smart filters (`All`, `Active`, `Completed`).    |
| **🔥 Habits & Streaks**        | Daily/weekly schedules, streak tracking with automatic **FoxCoins multipliers** (`1.2x`, `1.5x`, `2x`), and today-only completion lock.            |
| **⭕ Apple Fitness Dashboard** | Concentric **Activity Rings** for daily Tasks & Habits progress, plus a live FoxCoins & Next Reward summary card.                                  |
| **🏆 Rewards & Gamification**  | Earn **FoxCoins**, protect streaks with **Streak Freeze**, optional **Strict Mode** penalties, and redeem custom rewards in `/more/rewards/shop/`. |
| **📅 Calendar Settings**       | Switch between **Gregorian** and **Jalali (Solar)** calendars, customize start of week & weekend days (with canonical Gregorian storage).          |
| **🔔 Local Notifications**     | Android & Web reminders with custom chime (`foxtrack_chime.wav`) and custom brand icon (`ic_stat_foxtrack`).                                       |
| **💾 Full Offline Backup**     | Complete JSON Export & Import covering tasks, habits, habit logs, categories, rewards, coin logs, and settings.                                    |
| **🌐 Bilingual & Themes**      | **English (LTR)** & **Persian (RTL)** with Apple HIG Light & Dark modes.                                                                           |

---

## 🛠️ Technology Stack

- **Framework**: Next.js (App Router, Static Export `output: 'export'`)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS
- **Icons**: `@tabler/icons-react`
- **Local Database**: Dexie.js (IndexedDB) with versioned migrations
- **Validation**: Zod
- **Date Handling**: `date-fns` + custom Jalali/Gregorian utilities
- **Mobile Engine**: Capacitor (Android + `@capacitor/local-notifications`)
- **Testing**: Vitest + React Testing Library + `fake-indexeddb`
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
