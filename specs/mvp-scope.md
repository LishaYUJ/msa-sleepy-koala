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

- Set bedtime cutoff time, such as 12:00 AM
- Store user timezone
  - User selects timezone via a **scrollable picker** (wheel/drum-roll style selector)
  - Backend exposes a `GET /api/timezones` endpoint returning all valid IANA timezone names grouped by region
  - Frontend displays these in a scrollable list for user-friendly timezone selection
- Update nickname
- Store theme preference if needed

### Bedtime Check-in

- User clicks **“I’m going to sleep”**
- Backend records check-in timestamp in UTC
- Backend determines whether check-in is on time or late based on the user’s timezone and cutoff time
- Prevent duplicate check-ins for the same local date

### Streak System

- Calculate current early-sleep streak
- Increase streak after consecutive on-time check-ins
- Reset or break streak after late or missed check-in

### Koala Mood

- Display koala mood based on recent check-in status and streak
- Example moods: calm, sleepy, tired, exhausted, champion

### Badge System

- Unlock badges for key milestones
- Example badges:
  - First Sleep
  - 3-Day Koala Care
  - One Week Calm
  - Comeback Koala

### Leaderboard

- Show top users ranked by current streak
- Display nickname and streak only
- Do not expose exact check-in times, email addresses, timezones, or personal check-in history

### Frontend

- React with TypeScript
- Responsive UI for desktop and mobile
- React Router navigation
- Zustand state management
- Light/dark theme switching
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
3. Theme switching: light/dark mode

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
- Docker, unless time allows
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
