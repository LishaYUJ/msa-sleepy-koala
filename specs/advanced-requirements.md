# Advanced Requirements

## Overview

The MVP will include three advanced requirements from the MSA Phase 2 Software Stream advanced requirements list.

These advanced features are part of the MVP from the beginning rather than being added at the end.

## Advanced Requirement 1: State Management Library

### Selected Technology

**Zustand**

### Purpose

Zustand will manage shared frontend state across the React application.

### State Managed

Zustand may manage:

- authenticated user
- JWT token or auth status
- today’s check-in status
- current streak
- koala mood
- badge data
- leaderboard data
- theme preference

### Why Zustand

Zustand was selected because it is lightweight, simple to integrate, and easier to use than Redux for a small-to-medium React project.

It helps avoid excessive prop drilling between components such as Dashboard, KoalaCard, BadgeList, Leaderboard, and Settings.

### Example Use Cases

- After the user checks in, Zustand updates today’s check-in status, current streak, koala mood, and badge data.
- After the user changes theme, Zustand updates the app-wide theme state.
- After login, Zustand stores the authenticated user state.

---

## Advanced Requirement 2: Security Measures

The project will implement multiple security measures.

### Security Measure A: Password Hashing

User passwords must never be stored in plaintext.

During registration, the backend stores only a hashed password. During login, the entered password is verified against the stored hash.

Importance:

- protects user accounts if the database is exposed
- follows standard authentication security practice
- prevents plaintext password leakage

### Security Measure B: Authorization

Protected endpoints require authentication.

A user should only be able to access their own private records, including settings, check-ins, and badges.

Importance:

- prevents one user from accessing another user’s sleep-related habit records
- protects private personal behaviour data
- ensures leaderboard is the only intentionally shared view

### Security Measure C: Data Validation

The backend validates user input.

Examples:

- email must be valid
- password must meet minimum requirements
- nickname must not be empty
- cutoff time must be valid
- timezone must be valid
- duplicate check-ins for the same local date are rejected

Importance:

- prevents invalid data from entering the database
- reduces unexpected backend errors
- improves reliability and security

### Privacy-aware Leaderboard

The leaderboard only exposes:

- rank
- nickname
- current streak

It does not expose:

- email
- exact check-in time
- timezone
- full sleep check-in history
- late check-in details

---

## Advanced Requirement 3: Theme Switching

### Feature

The app supports light and dark mode.

### Why It Fits the Project

Sleepy Koala is a bedtime app, so dark mode is especially relevant because users may interact with it at night.

### Implementation Idea

- Theme state managed by Zustand.
- User preference can be saved in localStorage or backend UserSettings.
- Components use theme-aware styling.
- The Settings page includes a theme toggle.

### User-facing Value

- dark mode provides a more comfortable bedtime experience
- light mode supports daytime review of streaks, badges, and leaderboard
- theme switching improves visual polish and user control

---

## README Checklist Version

The README should explicitly list the three advanced requirements to be marked:

- [ ] Zustand state management
- [ ] Security measures: password hashing, authorization, and data validation
- [ ] Theme switching: light/dark mode

Only the advanced features explicitly listed in the README should be expected to be marked.
