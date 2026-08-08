# Advanced Requirements

## Overview

The MVP implements three advanced requirements from the MSA Phase 2 Software Stream advanced requirements list.

These advanced features are integrated into the application architecture and are listed in the repository root README for marking.

## Advanced Requirement 1: State Management Library

### Selected Technology

**Zustand**

### Purpose

Zustand manages shared frontend state across the React application.

### State Managed

Zustand may manage:

- authenticated user
- JWT token or auth status
- today’s check-in status
- current streak
- koala mood
- badge data
- leaderboard data

### Why Zustand

Zustand was selected because it is lightweight, simple to integrate, and easier to use than Redux for a small-to-medium React project.

It helps avoid excessive prop drilling between components such as Dashboard, KoalaCard, BadgeList, Leaderboard, and Settings.

### Example Use Cases

- After the user checks in, Zustand updates today’s check-in status, current streak, koala mood, and badge data.
- After login, Zustand stores the authenticated user state.

---

## Advanced Requirement 2: Security Measures

The project implements multiple security measures.

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

## Advanced Requirement 3: Dockerization

### Selected Technology

**Docker and Docker Compose**

### Purpose

Docker packages the React frontend and ASP.NET Core backend into reproducible containers. Docker Compose starts the complete application and its persistent SQLite storage as one stack.

### Implementation

- The frontend uses a multi-stage Node and Nginx image.
- Nginx serves the React SPA and proxies same-origin `/api` requests to the backend container.
- The backend uses a multi-stage .NET build and runs as the non-root `app` user.
- Docker Compose supplies non-secret development configuration and persists SQLite data in a named volume.
- Entity Framework migrations run automatically only when `Database__MigrateOnStartup=true`.
- Both containers expose health checks, and the frontend waits for a healthy backend.

### Importance

- provides a consistent runtime across development machines
- reduces setup errors caused by local Node, .NET, or web-server differences
- verifies that the frontend and backend can be deployed independently
- keeps local container data between restarts without committing database files

---

## README Checklist Version

The README should explicitly list the three advanced requirements to be marked:

- [x] Zustand state management
- [x] Security measures: password hashing, authorization, and data validation
- [x] Dockerization using Docker and Docker Compose

Only the advanced features explicitly listed in the README should be expected to be marked.
