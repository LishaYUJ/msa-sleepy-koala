# User Flow

## First-time User Flow

1. User visits the Sleepy Koala landing page.
2. User registers an account using email, password, and nickname.
3. User sets a bedtime cutoff time, such as 12:00 AM.
4. The app detects or stores the user’s timezone.
5. User lands on the dashboard.
6. Dashboard shows:
   - koala mood
   - today’s check-in status
   - current streak
   - badges summary
   - leaderboard preview

## Returning User Flow

1. User logs in.
2. Frontend receives authentication token.
3. Dashboard calls the backend summary API.
4. The user sees:
   - whether they have checked in today
   - their current streak
   - koala mood
   - unlocked badges
   - current leaderboard ranking if available

## Daily Bedtime Check-in Flow

1. User opens the app before going to bed.
2. User clicks **“I’m going to sleep”**.
3. Frontend sends a check-in request to the backend.
4. Backend records the current UTC timestamp.
5. Backend converts the timestamp according to the user’s timezone.
6. Backend compares the local check-in time with the user’s cutoff time.
7. Backend marks the check-in as:
   - `onTime`, if before or equal to the cutoff time
   - `late`, if after the cutoff time
8. Backend updates streak, koala mood, and badge status.
9. Frontend updates the dashboard through Zustand state.

## On-time Check-in Result

If the user checks in before the cutoff time:

1. Check-in status becomes `onTime`.
2. Current streak increases.
3. Koala mood becomes calm or happy.
4. Relevant badges may be unlocked.
5. Leaderboard ranking may improve.

## Late Check-in Result

If the user checks in after the cutoff time:

1. Check-in status becomes `late`.
2. Current streak resets or breaks.
3. Koala mood becomes tired or panda-eyed.
4. No early-sleep badge is unlocked for that day.

## Badge Flow

1. User completes a check-in.
2. Backend evaluates badge conditions.
3. New badges are added to the user’s account if conditions are met.
4. Frontend displays newly unlocked badges.

Example badge conditions:

| Badge | Condition |
|---|---|
| First Sleep | First on-time check-in |
| 3-Day Koala Care | 3 consecutive on-time check-ins |
| One Week Calm | 7 consecutive on-time check-ins |
| Comeback Koala | Returns to on-time check-ins after breaking a streak |

## Leaderboard Flow

1. User opens the leaderboard page.
2. Frontend calls the leaderboard API.
3. Backend returns top users ranked by current streak.
4. Frontend displays only:
   - rank
   - nickname
   - current streak

The leaderboard does not show email, timezone, exact check-in time, late history, or detailed sleep records.

## Settings Flow

1. User opens the settings page.
2. User updates:
   - nickname
   - bedtime cutoff time
   - theme preference
3. Frontend sends update request to backend.
4. Backend validates and saves changes.
5. Zustand state is updated so the UI reflects the latest settings.
