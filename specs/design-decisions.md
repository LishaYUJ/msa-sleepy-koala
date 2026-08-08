# Design Decisions

## Decision 1: Track Bedtime Intention Instead of Actual Sleep Onset

### Decision

The app records when the user clicks **“I’m going to sleep”** rather than attempting to detect when the user actually falls asleep.

### Reason

Actual sleep detection would require wearable devices, mobile sensors, or integration with platforms such as Apple Health or Google Fit. This would significantly increase technical complexity and privacy concerns.

For the MVP, the focus is habit formation and gamification, not medical or biometric sleep tracking.

### Outcome

The app is positioned as a bedtime check-in and habit-building tool, not a medical sleep tracker.

---

## Decision 2: Heart-rate Detection Is Future Work

### Decision

Heart-rate detection will not be included in the MVP.

### Reason

Heart-rate verification could reduce false check-ins, but it would require access to wearable data and health APIs.

This introduces:

- additional platform dependencies
- privacy concerns
- data consent requirements
- more complex testing
- higher implementation risk

### Outcome

Heart-rate detection is listed as a future enhancement.

---

## Decision 3: Use a Koala as Emotional Feedback, Not as the Only Core Feature

### Decision

The koala mascot will provide visual and emotional feedback, but the core gamification system will be based on check-ins, streaks, badges, and leaderboard ranking.

### Reason

The project should not depend entirely on mascot artwork. Since custom illustration may take time, the MVP can use simple AI-generated images, icons, emoji, or CSS-based visual cards.

### Outcome

The app remains functional even if mascot graphics are simple.

---

## Decision 4: Badges Are MVP Rewards; Cosmetics Are Future Work

### Decision

Badges will be the main achievement reward in the MVP. Unlockable koala cosmetics will be treated as future work.

### Reason

Badges are simpler to implement and clearly support gamification. A cosmetic system would require:

- additional assets
- item inventory tables
- equip/unequip logic
- more UI screens
- more testing

### Outcome

The MVP remains focused and achievable.

---

## Decision 5: Privacy-aware Leaderboard

### Decision

The leaderboard only displays nickname and current streak.

### Reason

Sleep-related behaviour is personal. Users should not be able to view other users’ exact check-in times, timezones, emails, or late records.

### Outcome

The leaderboard supports competition while protecting user privacy.

---

## Decision 6: Store Detailed Check-ins in Backend but Restrict Access

### Decision

The backend database stores check-in records, but each user can only access their own detailed records.

### Reason

Persistent storage is required for streaks, badges, history, and leaderboard calculations. However, data access must be restricted through authorization.

### Outcome

The app supports full-stack functionality while maintaining reasonable privacy boundaries.

---

## Decision 7: Use Zustand for Frontend State Management

### Decision

Use Zustand instead of Redux for the frontend state management requirement.

### Reason

Zustand is lightweight and easier to implement for this project. It is sufficient for managing shared state such as user session, check-in status, streak, koala mood, badges, and leaderboard data.

### Outcome

The project satisfies the state management advanced requirement without adding unnecessary complexity.

---

## Decision 8: Include Advanced Requirements from the Start

### Decision

Advanced requirements will be included in the MVP architecture from the beginning.

### Reason

Adding advanced requirements at the end could require major refactoring. Security, state management, and containerization affect the overall structure of the application.

### Outcome

The project will be built around the selected advanced requirements from the start.

---

## Decision 9: Use Low-fidelity Figma Before Development

### Decision

Create a low-fidelity Figma design before implementing the full frontend, but do not spend too long polishing visuals before the backend works.

### Reason

The project needs a clear design direction, but the main assessment risk is failing to complete the required full-stack functionality, deployment, tests, and documentation.

### Outcome

Figma will guide layout and user flow, while implementation remains the priority.

---

## Decision 10: Avoid Server-side Timezone Detection and Conversion for Bedtime Check-in

### Decision

For check-in evaluation, the MVP does not use server-side timezone detection or timezone conversion of server time. Instead, the frontend sends the device's local date and local time of the user's check-in to the backend. The backend uses the submitted local time directly to compare against the user's configured bedtime and decide if it is on time or late. The backend uses the submitted local date to calculate streaks and enforce once-daily check-in rules.

Additionally, to avoid midnight-crossing complexity in the MVP, the bedtime settings are restricted to evening times (20:00–23:59).

### Reason

Relying on server-side conversion of UTC time to user local time requires robustly managing timezones, offsets, and edge cases, which is highly error-prone and complex. By directly submitting the local date and local time from the client device:
1. The backend remains simple, clean, and decoupled from client timezone shifts.
2. The user's local date determines the uniqueness of their check-in, avoiding duplicate check-ins on the same day.
3. Bedtime restriction to 20:00–23:59 simplifies evaluation since a check-in at (e.g.) 22:15 is compared directly with bedtime (e.g. 22:00) without cross-midnight logic.

Post-MVP, a specific check-in window (e.g., within 3 hours before/after bedtime) can be implemented to handle cases like a late check-in at 05:00 being misclassified.

### Outcome

A simpler and more reliable codebase that relies on client-provided local context for check-in evaluation while maintaining correct streak calculations.
