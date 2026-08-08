# Test Plan

## Overview

The project requires unit tests for both frontend and backend. Testing should focus on key business logic, security-related behaviour, and important UI states.

## Backend Unit Tests

### Authentication Tests

- Registering a new user stores a hashed password, not plaintext.
- Registering with an invalid email fails.
- Registering with an empty nickname fails.
- Logging in with valid credentials returns a token.
- Logging in with invalid credentials is rejected.

### Authorization Tests

- Authenticated user can access their own settings.
- Authenticated user can access their own check-in history.
- User cannot access another user’s check-in records.
- User cannot delete another user’s check-in record.

### Settings Tests

- User can update cutoff time.
- Invalid cutoff time is rejected.
- Invalid timezone is rejected.
- User can update nickname.

### Check-in Logic Tests

- Check-in before cutoff time is marked as `onTime`.
- Check-in exactly at cutoff time is marked as `onTime`.
- Check-in after cutoff time is marked as `late`.
- Check-in stores UTC timestamp.
- Check-in calculates local date based on timezone.
- Duplicate check-in for the same local date is rejected.

### Streak Tests

- First on-time check-in creates streak of 1.
- Consecutive on-time check-ins increase streak.
- Late check-in resets or breaks streak.
- Missed day breaks streak if implemented.
- Longest streak updates when current streak exceeds previous longest.

### Badge Tests

- First on-time check-in unlocks First Sleep badge.
- Three consecutive on-time check-ins unlock 3-Day Koala Care badge.
- Seven consecutive on-time check-ins unlock One Week Calm badge.
- Already unlocked badges are not duplicated.

### Leaderboard Tests

- Leaderboard is sorted by current streak descending.
- Leaderboard returns only nickname and current streak.
- Leaderboard does not expose email.
- Leaderboard does not expose exact check-in times.
- Leaderboard does not expose timezone.

## Frontend Unit Tests

### Dashboard Tests

- Dashboard displays current streak.
- Dashboard displays today’s check-in status.
- Dashboard displays koala mood.
- Dashboard shows check-in button when user has not checked in today.
- Dashboard disables or changes check-in button after today’s check-in.

### KoalaCard Tests

- KoalaCard shows calm mood for on-time status.
- KoalaCard shows tired or panda-eye mood for late status.
- KoalaCard handles missing data gracefully.

### CheckInButton Tests

- Button triggers check-in action when clicked.
- Button shows loading state while request is in progress.
- Button shows success result after successful check-in.
- Button shows error if duplicate check-in is rejected.

### BadgeList Tests

- Unlocked badges are displayed as unlocked.
- Locked badges are displayed as locked.
- Newly unlocked badges appear after check-in.

### Leaderboard Tests

- Leaderboard displays users in ranking order.
- Leaderboard displays nickname and streak.
- Leaderboard does not display private details.

### Settings Tests

- User can update cutoff time.
- User can update nickname.
- Invalid input shows validation error.

### Docker Tests

- Docker Compose builds the frontend and backend images.
- Backend and frontend health checks become healthy.
- Registration, login, settings, and check-in requests work through `http://localhost:3000/api`.
- SQLite data persists after `docker compose down` and a subsequent restart.

## Manual Testing Checklist

Before submission, manually verify:

- frontend deployment is accessible
- backend deployment is accessible
- Scalar API documentation is accessible
- login works on deployed site
- register works on deployed site
- check-in works on deployed site
- leaderboard loads on deployed site
- Docker Compose starts both healthy services
- responsive layout works on mobile width
- README deployment links are correct
- no secrets are committed to GitHub
