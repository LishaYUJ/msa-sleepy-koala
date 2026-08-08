# MVP Scope

## MVP Goal

The MVP should deliver a complete full-stack bedtime check-in experience with clear gamification features and the required advanced features integrated from the beginning.

The MVP should prioritise a working application over excessive visual polish or complex future features.

## In Scope

### User Account

- User registration
- User login
- Password hashing
- JWT-based authentication
- User nickname for leaderboard display

### User Settings

- Set bedtime cutoff time (limited to 21:00–00:00)
- Update nickname

### Bedtime Check-in

- User clicks **“I’m going to sleep”** during the check-in window (21:00–02:00)
- Backend records check-in timestamp in UTC
- Frontend sends the device's local date and local time to the backend
- Backend determines whether check-in is on time or late by comparing the submitted local time against the user's configured bedtime
- Prevent duplicate check-ins for the same local date
- If a check-in is completely missed by 02:00 AM, it is marked as missed.

### Streak System

- Calculate current early-sleep streak
- Increase streak after consecutive on-time check-ins
- Reset or break streak after late or missed check-in

### Koala Fatigue System

- Display koala illustration and mood based on recent check-in status and fatigue score
- Example states: healthy, weak, veryWeak

### Badge System

- Unlock badges for key milestones
- Badges:
  - First Sleep
  - 3-Day Koala Care
  - One Week Calm

### Leaderboard

- Show top users ranked by current streak
- Display nickname and streak only
- Do not expose exact check-in times, email addresses, timezones, or personal check-in history

### Frontend

- React with TypeScript
- Responsive UI for desktop and mobile
- React Router navigation
- Zustand state management
- Unit tests for key components

### Backend

- C# with .NET
- EF Core
- Database persistence
- CRUD operations
- Scalar API documentation UI
- Unit tests for key backend logic
- Deployed backend

### Advanced Requirements Included in MVP

The MVP will include these advanced requirements:

1. State management library: Zustand
2. Security measures: password hashing, JWT authorization, and data validation
3. Dockerization using Docker and Docker Compose

## Out of Scope for MVP

These features are intentionally excluded from the MVP:

- Actual sleep detection
- Heart-rate verification
- Apple Health integration
- Google Fit integration
- Push notifications
- Complex social friend system
- Cosmetic shop or koala wardrobe
- Multiplayer gameplay
- AI-generated sleep advice
- WebSockets
- Cypress end-to-end testing, unless time allows

## MVP Success Criteria

The MVP is successful if a user can:

1. Register and log in.
2. Set a bedtime cutoff time.
3. Click a bedtime check-in button.
4. See whether the check-in was on time or late.
5. See their current streak.
6. See koala mood feedback.
7. Unlock badges.
8. View a leaderboard.
9. Switch between light and dark mode.
10. Use the deployed frontend and backend.
