# Sleepy Koala Frontend MVP Design & Implementation Plan

This plan documents the design, architecture, and step-by-step approach to creating the React + TypeScript frontend for the Sleepy Koala bedtime check-in application, meeting all core and advanced requirements.

---

## Goal Description

The objetivo is to build a responsive, visually stunning web application (frontend) in the `/frontend` directory that connects with the .NET 10 backend running at `http://localhost:5125`. 

The frontend will implement:
1. **User Authentication**: Login / Registration screens.
2. **Bedtime Check-in**: A primary interactive control to check in, sending device-local date and time to the backend.
3. **Streak Tracker**: Tracks and displays current early-sleep streaks.
4. **Interactive Koala Mascot**: A custom CSS+SVG animated mascot that changes expression/mood based on user streak and check-in success.
5. **Leaderboard**: Displays rankings of top users by current streak.
6. **Badges/Achievements**: Displays grid of unlocked (colored) and locked (greyed out) badges.
7. **Settings Settings**: Lets the user configure their bedtime cutoff (valid only between 20:00–23:59), nickname, and theme preference.
8. **Theme Toggle**: Advanced requirement for light and dark modes tailored for bedtime viewing.
9. **Zustand State Store**: Clean global state for user session, active theme, settings, and dashboard information.
10. **Unit Testing**: Vitest and React Testing Library setup with coverage for core components.

---

## User Review Required

> [!IMPORTANT]
> **Timezone Simplification**:
> In accordance with **Decision 10** in the specs, we will not perform any timezone conversions on the server. The frontend will dynamically extract the device's local date (`YYYY-MM-DD` using Sweden locale format representation to avoid offsets) and local time (`HH:mm`) and post them during check-in. The settings panel will only update the nickname, cutoff time, and theme (no timezone select is needed).

> [!TIP]
> **Tailored Light/Dark Themes**:
> The theme switching will use global CSS variables mapped to dark/light tokens. The dark mode will use deep indigo and twilight shades appropriate for nighttime users to reduce eye strain, while the light mode will use organic pastel tones.

---

## Proposed Changes

### Configuration files

#### [MODIFY] [.gitignore](file:///Users/lishaaa/Downloads/msa-sleepy%20koala/.gitignore)
- Append `/frontend/node_modules/`, `/frontend/dist/`, and `/frontend/coverage/` to the ignore list.

### Frontend Project Setup

#### [NEW] [frontend (Directory)](file:///Users/lishaaa/Downloads/msa-sleepy%20koala/frontend)
Initialize Vite project inside `./frontend` using:
```bash
npx -y create-vite@latest ./ --template react-ts
```
Then install main dependencies:
- `zustand` (State management)
- `react-router-dom` (Routing)
- `lucide-react` (Theme & page icons)
And dev / test dependencies:
- `vitest` (Testing runner)
- `@testing-library/react` (Component testing)
- `@testing-library/jest-dom` (DOM matchers)
- `jsdom` (Test environment)
- `@types/react-router-dom` (TypeScript types)

#### [NEW] [vite.config.ts](file:///Users/lishaaa/Downloads/msa-sleepy%20koala/frontend/vite.config.ts)
- Configure Vite with dev server proxy to forward `/api` requests to the local .NET backend at `http://localhost:5125`.

---

### Component Styling & Core Logic

#### [NEW] [index.css](file:///Users/lishaaa/Downloads/msa-sleepy%20koala/frontend/src/styles/index.css)
- Implement CSS Variables for Dark/Light themes.
- CSS for glassmorphic elements, nightsky animated backgrounds (gentle drifting stars), input forms, buttons, and animations (pulse, shake, float).

#### [NEW] [api.ts](file:///Users/lishaaa/Downloads/msa-sleepy%20koala/frontend/src/services/api.ts)
- Base client for communicating with the backend APIs.
- Auto-injects the JWT `Bearer` token from Zustand store for authenticated endpoints.

#### [NEW] [useStore.ts](file:///Users/lishaaa/Downloads/msa-sleepy%20koala/frontend/src/stores/useStore.ts)
- Zustand store managing:
  - User session (token, nickname, email, user ID).
  - Active theme (`light` vs `dark`).
  - Dashboard details (today check-in status, current/longest streaks, koala mood, cutoff time, unlocked badges).
  - Actions for login, signup, logout, loadSummary, performCheckIn, updateSettings, toggleTheme.

---

### Page Components

#### [NEW] [App.tsx](file:///Users/lishaaa/Downloads/msa-sleepy%20koala/frontend/App.tsx)
- Sets up React Router paths:
  - `/login` / `/register` -> Login/register panels (redirect if already logged in).
  - `/` -> Protected Dashboard page.
  - `/leaderboard` -> Protected Leaderboard page.
  - `/badges` -> Protected Badges museum page.
  - `/settings` -> Protected Settings page.
  - Custom guards for authenticated vs unauthenticated redirects.

#### [NEW] [Navbar.tsx](file:///Users/lishaaa/Downloads/msa-sleepy%20koala/frontend/src/components/Navbar.tsx)
- Responsive layout supporting desktop (sidebar / high navbar) and mobile (bottom tabs). Includes theme switch toggle.

#### [NEW] [GlassCard.tsx](file:///Users/lishaaa/Downloads/msa-sleepy%20koala/frontend/src/components/GlassCard.tsx)
- Reusable glassmorphic styling wrapper with border gradients.

#### [NEW] [KoalaMascot.tsx](file:///Users/lishaaa/Downloads/msa-sleepy%20koala/frontend/src/components/KoalaMascot.tsx)
- Dynamic premium SVG animated mascot representing:
  - **Calm** (sleeping bubbles, chest breathing animation)
  - **Sleepy** (yawning, sleepy eyes)
  - **Tired** (drooping ears, neutral eyes)
  - **Exhausted** (swirling dazed eyes, slumped position)
  - **Champion** (little crown on head, happy greeting)

#### [NEW] [Auth.tsx](file:///Users/lishaaa/Downloads/msa-sleepy%20koala/frontend/src/pages/Auth.tsx)
- Authentication card supporting toggling between Login and Registration. Shows validation feedback.

#### [NEW] [Dashboard.tsx](file:///Users/lishaaa/Downloads/msa-sleepy%20koala/frontend/src/pages/Dashboard.tsx)
- Main screen with bedtime check-in status, animated Koala Mascot, check-in button, stats (current streak, longest streak), and a list of unlocked achievements.

#### [NEW] [Leaderboard.tsx](file:///Users/lishaaa/Downloads/msa-sleepy%20koala/frontend/src/pages/Leaderboard.tsx)
- Podium styling for top 3 and list format for ranks 4-50, displaying only nicknames and streaks.

#### [NEW] [Badges.tsx](file:///Users/lishaaa/Downloads/msa-sleepy%20koala/frontend/src/pages/Badges.tsx)
- Visual museum for accomplishments: showcases unlocked badges with full color/unlock timestamp and locked badges in semi-transparent grey.

#### [NEW] [Settings.tsx](file:///Users/lishaaa/Downloads/msa-sleepy%20koala/frontend/src/pages/Settings.tsx)
- Panels to update Nickname, Cutoff Time (20:00–23:59), Theme preferences, and to Log out.

---

### Backend Maintenance (Failing Integration Test)

#### [MODIFY] [ApiIntegrationTests.cs](file:///Users/lishaaa/Downloads/msa-sleepy%20koala/tests/ApiIntegrationTests.cs)
- Fix the failing JWT test assertion. Since configuration loads the default issuer `"SleepyKoalaApi"`, update `AuthToken_HasExpectedIssuerAudienceSubjectAndExpiration` to assert alignment with either the configured app settings issuer or bypass the custom override bug.

---

## Verification Plan

### Automated Tests
- Inside frontend:
  Run Vitest execution:
  ```bash
  npm run test
  ```
  Unit tests will cover stores (`useStore` actions), `KoalaMascot` mood rendering, and the check-in button behavior in `Dashboard`.

- Inside backend/test:
  Run .NET test runner:
  ```bash
  dotnet test
  ```
  Verify all 14 tests pass successfully.

### Manual Verification
- Launch the application locally:
  Ensure backend is running (already running in terminal on `http://localhost:5125`).
  Start Vite development server:
  ```bash
  npm run dev
  ```
- Use a browser subagent or manually verify:
  1. User signup and login.
  2. Bedtime cutoff settings change.
  3. Clicking "I'm going to sleep" to record on-time/late check-in.
  4. Mood of Koala mascot updating dynamically.
  5. Leaderboard loading correctly.
  6. Badges loading and locking/unlocking.
  7. Switching theme styles.
