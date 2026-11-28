# FoxTrack Product & Engineering Roadmap

**Version:** 1.0  
**Roadmap date:** 19 November 2026  
**Product direction:** Local-first personal task and productivity app  
**Platforms:** Web/PWA and Android (Capacitor)  
**Current baseline:** Phase 1 — Core offline Todo List, nearing completion

---

## 1. Product Vision

FoxTrack should become a fast, thoughtful, dependable personal productivity app that helps an individual capture tasks, organize responsibilities, plan their day, and focus on meaningful work.

It should combine the clarity of Microsoft To Do and Things, the flexible organization of Todoist, and the time-management tools of TickTick — without becoming a complex project-management suite.

**Positioning:** A simple, sharp, offline-first task manager that helps you stay on track.

### Product Principles

1. **Local-first:** Core functionality works without an account, backend, or internet connection.
2. **Fast capture:** Adding a task takes seconds.
3. **Progressive complexity:** Keep the default experience simple; reveal advanced capabilities only when useful.
4. **Reliable data:** Tasks survive restarts, app upgrades, and temporary failures.
5. **Native where it matters:** Use Android-native capabilities for notifications, widgets, and system integration.
6. **Consistent cross-platform behavior:** Share logic and UI where appropriate while respecting platform differences.
7. **No premature cloud architecture:** Keep clean boundaries for possible future sync, but do not implement accounts, backend, or sync now.
8. **Distinctive design:** Avoid generic dashboard patterns. FoxTrack should feel like a focused consumer product.

---

## 2. Current Baseline — Phase 1

Phase 1 is the foundation and should be considered complete only after the acceptance criteria below pass.

### Core Functionality

- Create, edit, delete, complete, and uncomplete tasks.
- Low, medium, and high priority levels.
- Optional due date.
- All, Active, and Completed filters.
- Useful task counts and predictable sorting.
- Responsive, mobile-first interface with floating action button (FAB).
- Light and dark themes.
- Local persistence with Dexie and IndexedDB.
- Offline operation via service worker.
- PWA installability.
- Capacitor Android build.

### Baseline Architecture

- Next.js App Router, React, and TypeScript.
- Static export where compatible with selected features.
- Tailwind CSS and customized shadcn/ui.
- Dexie.js as the canonical local database.
- Reactive database subscriptions such as `useLiveQuery`.
- Lightweight repository boundary between UI and persistence.
- Zustand only for transient UI state when genuinely needed.
- Capacitor for Android native capabilities.
- No backend, authentication, cloud sync, remote database, or server-dependent app features.

### Phase 1 Acceptance Checklist

- [x] CRUD and completion workflows work.
- [x] Data survives page refresh and browser restart.
- [x] Android data survives app termination and device restart.
- [x] Core operations work offline.
- [x] Normal app upgrades do not erase user data (Dexie migrations enforced).
- [x] Empty, loading, error, and success states are handled.
- [x] Keyboard and touch interactions are usable.
- [x] Light and dark themes are complete.
- [x] In-app GitHub update checker detects newer releases.
- [x] Production web build and Android package pipeline are established (with persistent release signing).
- [x] README documents setup, build, test, and release procedures.
- [x] Full backup (Export/Import) covering tasks, habits, habit logs, categories, and settings.
- [x] Calendar system settings (Gregorian / Jalali, custom start of week & weekend days) with Gregorian canonical storage.
- [x] Optional due time & custom per-task / per-habit reminder controls.
- [x] Local notifications on Android with custom notification sound (`foxtrack_chime.wav`) and dedicated channel.
- [x] Strict Apple HIG UI/UX polish across Light and Dark modes.

**Do not restart or rewrite Phase 1 merely to begin later phases.** Extend the existing implementation incrementally.

---

## 3. Roadmap at a Glance (Benchmarked against HabitNow, Focus To-Do & TickTick)

Phases are ordered by product value, user impact, and technical dependency, combining the strongest patterns from **HabitNow** (habits, streaks, categories), **Focus To-Do** (Pomodoro & focus analytics), and **TickTick** (smart views, subtasks, recurrence, Eisenhower matrix).

| Phase | Name                                                      | Main Outcome                                                                                                                | Priority           | Status        |
| :---- | :-------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------- | :----------------- | :------------ |
| **1** | Core Offline Foundation, Habits & Apple HIG               | Tasks (date + time), Habits, Categories, Jalali/Gregorian Calendar, Local Notifications (`foxtrack_chime.wav`), Full Backup | Foundation         | **Completed** |
| **2** | Task Depth & Organization _(TickTick / HabitNow)_         | Subtasks / Checklists, Projects (Lists), Tags, Global Search & Archive                                                      | **Next Milestone** | Planned       |
| **3** | Focus & Pomodoro _(Focus To-Do)_                          | Integrated Pomodoro timer linked to tasks, Focus Mode, ambient sounds & focus session history                               | **High**           | Planned       |
| **4** | Habit & Productivity Analytics _(HabitNow / Focus To-Do)_ | `/more/analytics/`: Streaks, completion rate heatmaps, focus time charts & weekly/monthly insights                          | **High**           | Planned       |
| **5** | Smart Planning & Recurrence _(TickTick)_                  | Recurring tasks, My Day / Next 7 Days smart views, Calendar View & manual drag-and-drop ordering                            | **High**           | Planned       |
| **6** | Android Native Power Features                             | Home-screen widgets (Today / Habits), App Shortcuts & quick-capture tile                                                    | **Medium**         | Planned       |
| **7** | Decision & Workflow Tools _(TickTick)_                    | Eisenhower Matrix (4 quadrants), Task Templates & Quick Add natural-language parsing                                        | **Medium**         | Later         |
| **8** | Cloud Sync & AI _(Optional Future)_                       | Optional encrypted sync, multi-device backup & smart scheduling assistant                                                   | **Future**         | Evaluative    |

---

# Phase 2 — Organization & Task Details

**Goal:** Evolve FoxTrack from a single task list into a useful personal task organizer without making the interface complicated.

This is the next major development phase.

## 2.1 Multiple Lists

Allow users to create and manage independent task lists.

### Features

- Create, rename, reorder, and delete a list.
- Change list color or icon.
- View tasks belonging to a list.
- Assign a task to a list.
- Move a task between lists.
- Provide a default `Inbox` or `General` list.
- Define safe behavior when deleting a list containing tasks: move tasks to Inbox or delete only after explicit confirmation.
- Provide useful empty states.

### UX Requirements

- Keep navigation compact.
- Make the current list obvious.
- Support a sensible default list for quick capture.
- Do not force users to choose a list for every new task.

### Acceptance Criteria

- [ ] Users can create, rename, reorder, and delete lists.
- [ ] Tasks remain associated with the correct list.
- [ ] Moving a task never duplicates it.
- [ ] List deletion follows a clear, safe policy.
- [ ] Existing Phase 1 tasks migrate into a default list without data loss.

## 2.2 Task Details

Introduce a task detail view or editing panel.

### Fields

- Title.
- Description / notes.
- Priority.
- Due date.
- Optional due time.
- List.
- Tags.
- Completion status.
- Creation timestamp.
- Last-updated timestamp.

### Features

- Edit task details.
- Preserve line breaks in notes.
- Support basic Markdown only if it materially improves usability.
- Display metadata clearly.
- Make the detail view usable on mobile (sheet) and desktop (panel/dialog).

### Explicitly Defer

- Comments.
- File attachments.
- Collaborative editing.
- Complex custom fields.

## 2.3 Subtasks / Checklists

Allow a task to contain smaller actionable items.

### Features

- Add, edit, delete, complete, and uncomplete a subtask.
- Display progress, such as `2 of 5 completed`.
- Show a compact checklist in task details.
- Preserve subtask order.
- Define whether completing all subtasks completes the parent; prefer explicit, predictable behavior.
- Define a safe cascade policy when deleting a parent task.

### Scope Limit

One subtask level is sufficient initially. Do not introduce unlimited nesting or a general-purpose project hierarchy.

## 2.4 Tags

Allow users to categorize tasks across lists.

### Features

- Create, rename, and delete tags.
- Assign multiple tags to a task.
- Remove tags from tasks.
- Optional tag colors.
- Filter tasks by tags.
- Show tags in task rows without visual clutter.

### UX Requirements

- Tag creation should be quick.
- Tags must remain optional.
- Colors must be accessible in both themes.
- Explain what happens to tasks when a tag is deleted.

## 2.5 Search

Provide fast local search.

### Search Scope

- Task title.
- Task description.
- List name.
- Tag name.

### Features

- Search as the user types.
- Clear search quickly.
- Highlight matching text where practical.
- Display useful empty results.
- Preserve search state while navigating where appropriate.

### Performance

Search should remain responsive with several thousand local tasks. Add indexes or optimized queries only when measurements justify them.

## 2.6 Archive

Allow users to remove old completed tasks from normal views without permanently deleting them.

### Features

- Archive a completed task.
- Restore an archived task.
- View archived tasks.
- Permanently delete an archived task after confirmation.
- Optional bulk archive for completed tasks.

## 2.7 Phase 2 Data Model Direction

Introduce only entities required by implemented features:

- `Task`
- `TaskList`
- `Subtask`
- `Tag`
- Task-tag relationship, using a simple Dexie-appropriate structure.

Do not build a generic entity framework or abstraction-heavy domain engine.

### Phase 2 Definition of Done

- [ ] Lists work reliably.
- [ ] Existing tasks migrate safely.
- [ ] Task details and subtasks work.
- [ ] Tags and local search work.
- [ ] Archive and restore work.
- [ ] Migrations are tested against realistic Phase 1 data.
- [ ] UI remains simple and responsive.
- [ ] All core features work offline.

---

# Phase 3 — Daily Planning & Smart Views

**Goal:** Help users decide what to work on today and understand upcoming responsibilities.

## 3.1 My Day

Create a dedicated daily planning view.

### Features

- Show tasks due today.
- Allow users to manually add tasks to My Day even if their due date differs.
- Remove tasks from My Day without deleting the original task.
- Show overdue tasks in a distinct, non-alarming section.
- Display a daily completion summary.
- Provide a clear action to add a task.
- Handle the start of a new day correctly.

### Important Product Decision

My Day should be a **view or planning assignment**, not a second copy of a task. A task has one canonical record. My Day references or derives membership from that record and its planning metadata.

Do not automatically move or duplicate tasks when the date changes.

## 3.2 Upcoming

- Group tasks by date.
- Show overdue, today, tomorrow, and future tasks.
- Provide a configurable look-ahead period if useful.
- Allow quick rescheduling.
- Keep tasks without due dates accessible through another view.

## 3.3 Smart Views

Suggested built-in views:

- Inbox.
- My Day.
- Upcoming.
- All Tasks.
- Important.
- Completed.
- Archived.

### Rules

- Smart views derive from canonical task data.
- They must not create duplicate task records.
- Counts must match displayed results.
- View definitions should be centralized rather than duplicated across components.

## 3.4 Manual Ordering

- Drag and drop on touch and desktop.
- Persist custom order locally.
- Provide a fallback when drag and drop is unavailable.
- Keep manual ordering separate from date/priority sorting.
- Explain or reset custom ordering when users switch sort modes.

## 3.5 Smart Filters

Initial filters:

- Overdue.
- Due today.
- Due this week.
- High priority.
- No due date.
- Completed.
- By list.
- By tag.

Do not create an advanced query language in this phase.

### Phase 3 Definition of Done

- [ ] My Day works without duplicating tasks.
- [ ] Upcoming groups tasks correctly by local date.
- [ ] Smart views remain consistent after edits and completion.
- [ ] Manual ordering persists.
- [ ] Filters combine predictably.
- [ ] Time-zone and date-boundary behavior is tested.

---

# Phase 4 — Recurring Tasks & Calendar

**Goal:** Support repeated responsibilities and give users a visual understanding of their schedule.

## 4.1 Recurring Tasks

### Initial Recurrence Patterns

- Every day.
- Every weekday.
- Every week.
- Selected weekdays.
- Every month.
- Every year.
- Every N days, weeks, or months, if the UX remains understandable.

### Behavior

- Completing a recurring occurrence creates or schedules the next occurrence.
- Skipping an occurrence must not silently mark it complete.
- Editing one occurrence must be distinguishable from editing the entire series.
- Deleting one occurrence must not accidentally delete the series.
- Users can pause or stop a recurrence.
- Month lengths and leap years are handled predictably.

### Recommended Data Approach

Represent the recurrence definition separately from generated task occurrences.

Possible concepts:

- Recurrence series / rule.
- Occurrence identifier.
- Scheduled local date/time.
- Completion state.

Do not implement recurrence by simply reopening the same completed task. Preserve meaningful completion history.

## 4.2 Calendar View

### Views

- Month.
- Week.
- Agenda / list.

Start with month and agenda if a full week view would delay delivery.

### Features

- Show tasks on due dates.
- Navigate between periods.
- Select a date to view its tasks.
- Create a task for a selected date.
- Reschedule a task.
- Distinguish overdue and completed tasks.
- Avoid overcrowding calendar cells.

### Scope Limits

- No full calendar provider integration initially.
- No event scheduling system.
- No external calendar synchronization.
- No complex time-blocking until core calendar usage is validated.

## 4.3 Time and Time-Zone Correctness

- Store timestamps consistently.
- Treat all-day due dates as calendar dates, not arbitrary UTC instants.
- Store timed tasks with an unambiguous instant and appropriate time-zone context.
- Test daylight-saving transitions.
- Test travel between time zones.
- Test month-end and leap-year recurrence behavior.

### Phase 4 Definition of Done

- [ ] Common recurrence patterns work.
- [ ] Editing one occurrence does not corrupt the series.
- [ ] Calendar and list views show consistent task data.
- [ ] Date/time behavior passes time-zone tests.
- [ ] Existing non-recurring tasks remain unaffected.

---

# Phase 5 — Android Native Experience

**Goal:** Make FoxTrack feel like a real Android application rather than merely a website packaged in a WebView.

This phase uses Capacitor and native Android code where required.

## 5.1 Local Notifications

Use Capacitor Local Notifications for scheduled reminders.

### Features

- Request notification permission at an appropriate moment.
- Schedule a reminder for a task.
- Support date-only and timed reminders with clear semantics.
- Cancel a reminder when its task is deleted.
- Reschedule a reminder when its date/time changes.
- Cancel or update reminders when a task is completed.
- Handle notification taps and open the relevant task.
- Provide notification settings.
- Handle denied permissions gracefully.

### Android Considerations

- Android 13+ notification permission.
- Exact alarm restrictions and user permission where applicable.
- Doze and battery optimization behavior.
- Device reboot and notification rescheduling behavior.
- Notification channels.
- Android version differences.

Do not promise exact delivery under all system conditions. Explain limitations where relevant.

## 5.2 Android Home-Screen Widgets

Implement native Android widgets using Kotlin and Jetpack Glance or another suitable Android widget API.

### Widget A — Today

- Show a compact list of today's tasks.
- Display priority or a subtle status indicator.
- Show completion state.
- Allow supported task completion actions.
- Tap a task to open its detail view.
- Provide a button to open FoxTrack.

### Widget B — Quick Add

- Provide a quick-add action.
- Open a lightweight native or app-based capture flow.
- Avoid building a complicated editor into the widget.

### Widget C — Focus

- Show one selected or most relevant task.
- Provide a shortcut to open focus mode.
- Keep the widget visually calm and compact.

### Native/Web Data Bridge

Android widgets run outside the WebView and cannot directly read IndexedDB.

Use a deliberate bridge:

1. The web app stores canonical task data in Dexie.
2. A Capacitor native plugin receives a small widget data snapshot.
3. Native code persists the snapshot using an appropriate local store such as DataStore or another suitable mechanism.
4. The widget reads this native snapshot.
5. Widget actions are sent through a native-to-app handoff.
6. The app updates Dexie as the canonical source of truth.
7. The app refreshes the widget snapshot.

Avoid maintaining two independent full task databases. Define freshness and conflict behavior for actions performed while the WebView is not running. Keep the first widget implementation conservative and predictable.

## 5.3 Android App Shortcuts

Consider launcher shortcuts:

- Add task.
- Open My Day.
- Open Upcoming.
- Open Focus.

Implement only after the core navigation destinations are stable.

## 5.4 Android Quality

- Test on multiple Android versions.
- Test different screen sizes.
- Test app process termination.
- Test device restart.
- Test permission denial and later permission changes.
- Test offline operation.
- Test widget refresh and stale data handling.
- Test notification tap routing.

### Phase 5 Definition of Done

- [ ] Local reminders work under documented Android constraints.
- [ ] Task changes correctly update scheduled notifications.
- [ ] At least one useful home-screen widget is available.
- [ ] Widget actions behave safely when the app is not running.
- [ ] Native and Dexie data remain consistent.
- [ ] Android-specific features fail gracefully when unavailable.

---

# Phase 6 — Backup, Restore & Data Portability

**Goal:** Protect user data in a product that does not rely on cloud synchronization.

This is especially important because local-first users may lose data if a device is lost, storage is cleared, or the app is uninstalled.

## 6.1 Export

- Export all user data to a JSON backup.
- Include lists, tasks, subtasks, tags, recurrence definitions, and relevant settings.
- Include a schema version.
- Include export timestamp.
- Use a documented backup format.
- Generate a clear filename.
- Use Android share/save mechanisms where appropriate.

## 6.2 Import / Restore

- Select a backup file.
- Validate the file before changing the database.
- Show a summary of what will be imported.
- Support restore into an empty database.
- Define whether import merges or replaces existing data.
- Make destructive replacement explicit.
- Handle duplicate identifiers safely.
- Reject unsupported or corrupted backup versions with a useful error.

## 6.3 Backup Compatibility

- Version the backup schema.
- Maintain migration logic for supported older backups.
- Test backups created by earlier app versions.
- Never partially overwrite user data after failed validation.
- Consider a temporary database or transactional strategy before committing a restore.

## 6.4 Data Safety UX

- Explain that local data is stored on the device.
- Remind users to export backups before changing devices or uninstalling.
- Show a last-backup date if automatic local backup is introduced.
- Never claim data is backed up unless a verified backup exists.

### Phase 6 Definition of Done

- [ ] Export includes all supported user data.
- [ ] Import validates before modifying data.
- [ ] Restore works on a clean installation.
- [ ] Older supported backup versions migrate correctly.
- [ ] Failed imports leave existing data intact.
- [ ] Backup and restore are tested on Android and web.

---

# Phase 7 — Focus & Productivity Tools

**Goal:** Add tools that help users execute tasks, not merely organize them.

These features should remain optional and must not make the core workflow heavier.

## 7.1 Pomodoro Timer

- Configurable focus duration.
- Short break.
- Long break.
- Configurable cycle count.
- Start, pause, resume, and reset.
- Associate a focus session with a task.
- Show session progress.
- Handle app backgrounding and device sleep.
- Provide an appropriate completion notification where permitted.

Do not rely on a JavaScript timer remaining alive while the app is suspended. Use a timestamp-based timer model and native scheduling where needed.

## 7.2 Focus Mode

- Display one selected task prominently.
- Reduce visual distractions.
- Provide quick completion and pause actions.
- Show an optional focus timer.
- Make returning to the full task list easy.

## 7.3 Eisenhower Matrix

Four quadrants:

1. Urgent and important.
2. Important, not urgent.
3. Urgent, not important.
4. Neither urgent nor important.

Do not force users to classify every task. Allow classification from task details or the matrix. Keep normal task lists usable without it.

## 7.4 Focus History

- Track completed focus sessions.
- Show total focus time.
- Show sessions by day and week.
- Keep metrics transparent and understandable.
- Avoid a complicated analytics dashboard.

### Phase 7 Definition of Done

- [ ] Timer behavior is reliable when the app is backgrounded.
- [ ] Focus sessions can be associated with tasks.
- [ ] Focus mode remains simple.
- [ ] Matrix classification does not duplicate task data.
- [ ] Statistics use clear definitions.

---

# Phase 8 — Insights, Templates & Personalization

**Goal:** Help users understand progress and adapt FoxTrack to their preferences.

## 8.1 Statistics

Start with meaningful metrics:

- Tasks completed today.
- Tasks completed this week.
- Completion trend.
- Overdue task count.
- Focus time, if Phase 7 is implemented.
- Completion by list, if useful.

### Rules

- Make metric definitions explicit.
- Avoid misleading productivity scores.
- Do not punish users for taking breaks.
- Keep analytics local.
- Provide a useful empty state.

## 8.2 Templates

Optional starter templates:

- Study plan.
- Weekly planning.
- Personal errands.
- Reading list.
- Travel checklist.
- Workday checklist.

### Features

- Create a list from a template.
- Preview template contents.
- Edit generated lists normally.
- Allow custom templates only if there is demonstrated demand.

## 8.3 Personalization

- Accent color selection.
- Light, dark, and system theme.
- Compact or comfortable task density.
- Optional task display preferences.
- Configurable default sort order.
- Configurable default landing page.
- Notification preferences.

Avoid a large theme marketplace or complex customization engine.

## 8.4 Keyboard Shortcuts

Useful initial shortcuts:

- Quick add.
- Search.
- Navigate to My Day.
- Navigate to Inbox.
- Complete selected task.
- Open task details.
- Close modal or panel.

Shortcuts must not interfere with normal text input.

## 8.5 Accessibility & Internationalization

- Keyboard navigation.
- Screen-reader labels.
- Visible focus indicators.
- Sufficient color contrast.
- Reduced-motion support.
- Correct RTL layout support (`useDirection`).
- Translation-ready strings.
- Locale-aware date and number formatting.

### Phase 8 Definition of Done

- [ ] Statistics are correct and useful.
- [ ] Templates create normal editable data.
- [ ] Theme and display preferences persist.
- [ ] Keyboard shortcuts are discoverable.
- [ ] Accessibility checks pass for major workflows.

---

# Phase 9 — Advanced Capture & Lightweight Automation

**Goal:** Reduce friction between thinking of a task and capturing it.

Do not start until the task model, dates, recurrence, and smart views are stable.

## 9.1 Quick Add

- Add a task from any major screen.
- Keep keyboard focus behavior predictable.
- Default to the current list or Inbox.
- Support optional priority and date without opening a large form.
- Provide a fast path for simple task creation.

## 9.2 Natural-Language Date Input

Examples:

- `Call Alex tomorrow`
- `Submit report next Friday`
- `Pay rent on the first day of every month`

### Requirements

- Parse dates locally where practical.
- Show the interpreted date before saving.
- Handle ambiguous dates safely.
- Respect locale and time zone.
- Provide a manual correction path.
- Never silently infer an incorrect date.

This does not require an AI backend. Start with deterministic parsing and evaluate AI only if there is a clear product need.

## 9.3 Lightweight Rules

Potential examples:

- When a recurring task is completed, create the next occurrence.
- When a due date passes, show the task in Overdue.
- When a task is added to My Day, show it in the My Day view.
- When a task is completed, optionally archive it after a user-defined period.

Avoid a general-purpose automation engine.

## 9.4 Capture Entry Points

Evaluate:

- Android launcher shortcut.
- Android share target.
- Notification action.
- Quick Add widget.
- PWA shortcut.

Implement only entry points that are useful and technically reliable.

### Phase 9 Definition of Done

- [ ] Quick Add is consistently accessible.
- [ ] Natural-language parsing displays a confirmation.
- [ ] Ambiguous input is not silently misinterpreted.
- [ ] Rules remain understandable and testable.

---

# Phase 10 — Optional Product Expansion

These features are deliberately outside the core roadmap. Revisit them only after FoxTrack's core value is validated.

## 10.1 Habit Tracker

Potential capabilities:

- Daily and weekly habits.
- Completion history.
- Streaks.
- Calendar heatmap.
- Habit reminders.

Consider this only if users clearly want recurring behavior tracking beyond normal tasks. It may deserve a separate product area.

## 10.2 Collaboration

Potential capabilities:

- Shared lists.
- Assign tasks to other people.
- Comments.
- Shared completion state.

**Dependency:** Requires identity, backend, authorization, conflict resolution, and synchronization. It is not compatible with the current fully local-only architecture without a substantial product and engineering change.

## 10.3 Cloud Sync

Potential capabilities:

- Account and device identity.
- Multi-device synchronization.
- Conflict resolution.
- Remote backup.
- Shared lists.

**Decision: Do not implement now.** Keep the local repository boundary clean so a future remote repository or synchronization layer can be introduced without coupling the UI directly to a server.

Do not build a speculative sync engine, outbox, or remote data model in the current phases.

## 10.4 Integrations

Possible future integrations:

- Calendar providers.
- Email-to-task capture.
- External automation services.
- Desktop integrations.

Each integration should solve a demonstrated user problem and have a clear privacy and maintenance cost.

## 10.5 AI Assistant

Possible future capabilities:

- Break a large task into subtasks.
- Suggest a daily plan.
- Summarize a long task description.
- Suggest priorities.
- Convert natural language into tasks.

Defer AI until core workflows are reliable and there is evidence that AI improves them. AI must remain optional and must not be required for basic task management.

---

# 4. Technical Architecture & Engineering Guardrails

## 4.1 Keep the Local-First Architecture

The application should remain fully functional without a backend.

Suggested high-level boundaries:

```text
src/
  app/
  components/
  features/
    tasks/
    lists/
    planning/
    calendar/
    focus/
    settings/
  db/
    database.ts
    schema.ts
    migrations/
  repositories/
  native/
    notifications/
    widgets/
    platform.ts
  hooks/
  lib/
  types/
```

This is a conceptual guide, not a requirement to create every folder immediately. Add modules only when their functionality is implemented.

## 4.2 Database Rules

- Dexie/IndexedDB remains the canonical application database.
- Use stable IDs.
- Store creation and update timestamps consistently.
- Use explicit database version migrations (`db.version(n).stores(...).upgrade(...)`).
- Keep data access out of presentation components.
- Avoid duplicating database state in Zustand.
- Use transactions for related multi-record changes.
- Define deletion and cascade behavior.
- Test migrations using realistic existing data.
- Avoid destructive migrations.
- Keep backup schema versioning separate from Dexie schema versioning.

## 4.3 Date and Time Rules

- Distinguish all-day dates from timed events.
- Avoid treating a local calendar date as a UTC timestamp.
- Handle daylight-saving changes.
- Test time-zone changes.
- Test recurring tasks at month and year boundaries.
- Centralize date logic rather than implementing it independently in components.

## 4.4 Native Capability Rules

- Keep Android-specific code behind a small native capability layer.
- Detect platform capability rather than assuming every runtime is Android.
- Provide graceful fallbacks on web.
- Do not put Android-only imports into shared code paths.
- Document plugin installation and native build requirements.
- Test native features on real devices.

## 4.5 PWA and Static Export

- Preserve compatibility with the chosen static export strategy.
- Do not introduce server-dependent Next.js features without deliberately revisiting deployment architecture.
- Treat the service worker as an app-shell and static-asset caching mechanism.
- Do not treat the service worker as the task database.
- Ensure application updates do not silently destroy local data.

## 4.6 Performance

- Keep initial startup fast.
- Avoid unnecessary dependencies.
- Avoid loading large feature modules before they are needed.
- Use database indexes based on actual query patterns.
- Measure before optimizing.
- Avoid complex state management when Dexie subscriptions are sufficient.

---

# 5. Release & Update Strategy

FoxTrack publishes Android APK files through a **public GitHub repository and GitHub Releases**. Use this as the distribution mechanism without introducing a dedicated backend.

## 5.1 Native APK Updates — First Priority

In-app Update Manager is implemented in `src/components/update-checker/`.

### Release Discovery

Use the GitHub REST API:

```http
GET https://api.github.com/repos/OWNER/REPOSITORY/releases/latest
```

The app:

- Reads the latest release tag.
- Compares it with the installed app version (`NEXT_PUBLIC_APP_VERSION`).
- Finds the correct APK asset.
- Reads release notes.
- Displays whether an update is available via a modal.
- Handles drafts, prereleases, missing assets, and network errors gracefully.
- Stores dismissed version in `sessionStorage`.
- Avoids checking GitHub aggressively or blocking offline use.

For a public repository, anonymous access is sufficient for basic release discovery. Never embed a personal GitHub token in the app.

### Download and Installation

- **Initial Simple Option (Current):** Show release notes, open the GitHub APK download link or direct `.apk` asset download, let Android handle download and package installation.
- **Integrated Option (Future):** Download the APK inside FoxTrack, verify SHA-256, pass to Android's package installer using native FileProvider.

### Version and Signing Rules

- Keep Android `applicationId` stable.
- Preserve the signing key securely.
- Increment `versionCode` for every Android release.
- Use a consistent version naming scheme (SemVer).
- Never publish signing secrets in GitHub.
- Test upgrades from the previous public APK, not only clean installs.

## 5.2 Web Bundle OTA — Later

Only introduce OTA when frequent web-only releases justify the added complexity.

Possible approach:

- Build a compatible web bundle.
- Package the bundle as a ZIP.
- Attach it to a GitHub Release.
- Publish a manifest containing bundle version, compatible native version, asset location, and integrity metadata.
- Use a compatible Capacitor live-update plugin (e.g. Capawesome Live Update).
- Verify the bundle before activation.
- Retain a known-good bundle for rollback.

---

# 6. Security, Privacy & Reliability

## Data Protection

- Explain that task data is stored locally on device.
- Avoid sending task content to external services.
- Do not collect analytics by default without a clear privacy decision.
- Keep exported backups under the user's control.
- Avoid logging sensitive task content.
- Handle imported files as untrusted input.
- Validate backup structure and size before processing.

## Update Security

- Use HTTPS for release discovery and downloads.
- Verify downloaded APK or bundle integrity.
- Keep signing keys private.
- Prevent downgrade or incompatible update behavior where appropriate.

## Reliability

- Handle IndexedDB failures and quota errors.
- Provide actionable error messages.
- Avoid deleting data after unexpected failures.
- Test app upgrades.
- Test interrupted downloads and device restarts.
- Test offline startup.

---

# 7. Testing Strategy

Every data-critical feature must have meaningful tests.

## Unit Tests

- Date and recurrence calculations.
- Task sorting and filtering.
- Smart view membership.
- Priority behavior.
- Backup serialization and validation.
- Version comparison.
- Data migration functions.

## Database Tests

- CRUD operations.
- List/task relationships.
- Subtask relationships.
- Tag assignment.
- Archive and restore.
- Recurrence generation.
- Transaction rollback.
- Dexie schema migrations.

## Component Tests

- Task creation, editing, and FAB modal.
- List navigation.
- Search and filters.
- My Day interactions.
- Calendar interactions.
- Empty and error states.
- Accessibility labels and keyboard behavior.

## Real-Device Testing

Native notifications, package installation, widgets, and background behavior must be tested on real Android devices.

---

# 8. Scope Control — What Not to Build Yet

Unless user feedback demonstrates a strong need, defer:

- User accounts and authentication.
- Backend and remote database.
- Cloud synchronization.
- Shared lists and collaboration.
- Comments and chat.
- Attachments and file management.
- Complex project management.
- Kanban boards.
- Full calendar-provider synchronization.
- General-purpose automation engine.
- AI assistant.
- Large analytics dashboards.
- Social features.
- Subscription and payment infrastructure.

These features add significant maintenance and architectural cost and are not required to make the core local-first product valuable.

---

# 9. Recommended Implementation Order

1. Finish and stabilize Phase 1 (Acceptance checklist verification).
2. Establish safe Dexie migration patterns (`db.version(2).stores(...).upgrade(...)`).
3. Standardize GitHub Release naming and semantic versioning.
4. Implement Multiple Lists (`TaskList` entity, Inbox default list, list picker).
5. Implement Task Details (notes, detail modal/panel).
6. Implement Subtasks (single-level checklists).
7. Implement Tags (cross-list filtering).
8. Implement Fast Local Search.
9. Implement Archive and Restore.
10. Implement My Day (daily planning view without duplicating records).
11. Implement Upcoming and Smart Views.
12. Implement Recurring Tasks (rule-based series generation).
13. Implement Calendar View (month and agenda views).
14. Implement Local Notifications (Capacitor reminders).
15. Implement the first Android Today Widget (Jetpack Glance bridge).
16. Implement JSON Backup, Export, and Restore.
17. Add Pomodoro and Focus Mode.
18. Add Statistics, Templates, and Personalization.
19. Evaluate advanced capture and lightweight automation based on feedback.

---

# 10. Definition of Done for Every Feature

No feature is complete merely because its main screen works:

- [ ] User problem and intended behavior are clearly described.
- [ ] Scope and non-goals are explicit.
- [ ] UX states are designed: normal, empty, loading, error, and confirmation.
- [ ] Data model changes are justified and documented.
- [ ] Database migrations are implemented and tested.
- [ ] Existing user data is preserved without loss.
- [ ] Offline behavior is defined and tested.
- [ ] Responsive behavior is tested across mobile and desktop.
- [ ] Keyboard and accessibility behavior (`Tab`, `Escape`, focus rings) are verified.
- [ ] Unit and integration tests are added.
- [ ] Android-native behavior is tested on a real device when relevant.
- [ ] Documentation and matching `.cursor/rules/*.mdc` are updated.
- [ ] No unrelated refactors or feature creep bundled into the work.

---

# 11. Development Workflow for Agents & Contributors

Use a strict incremental workflow:

1. Inspect the current implementation and relevant files.
2. Summarize current architecture and identify the smallest required changes.
3. Propose data model and migration impact before editing database code.
4. Implement one coherent feature at a time.
5. Run focused tests after each meaningful change (`pnpm format:check && pnpm lint && pnpm exec tsc --noEmit && pnpm test`).
6. Report files changed, migrations added, tests run, and known limitations.
7. Stop and wait for review before moving to the next feature.

### Agent Guardrails

- Do not rewrite the application.
- Do not replace working architecture without a demonstrated reason.
- Do not add dependencies without explaining their value.
- Do not install overlapping UI or state-management libraries.
- Do not create abstractions for hypothetical future requirements.
- Do not implement cloud sync or backend functionality.
- Do not modify unrelated features.
- Preserve the existing design language and improve it incrementally.
- Prefer small, reviewable changes over large batches.

---

# 12. Strategic Recommendation

FoxTrack should earn complexity gradually.

The most valuable near-term product is not a clone of every feature in Todoist or TickTick. It is a polished, reliable, offline-first task manager with:

1. Excellent task organization.
2. A genuinely useful daily planning workflow.
3. Reliable recurrence and reminders.
4. A high-quality Android widget experience.
5. Strong local data protection and portability.

**Recommended next milestone:** Complete Phase 2 — Organization & Task Details — while establishing safe database migrations and maintaining a reliable GitHub-based APK update flow.
