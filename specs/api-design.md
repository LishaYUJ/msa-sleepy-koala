# API Design

## Overview

The backend exposes REST APIs for authentication, settings, bedtime check-ins, badges, dashboard summary, and leaderboard.

All protected endpoints require authentication.

The backend should expose Scalar API documentation UI.

## Authentication APIs

### POST /api/auth/register

Creates a new user account.

Authentication: Not required.

Request body:

```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "nickname": "SleepyCat"
}
```

Response:

```json
{
  "userId": "string",
  "email": "user@example.com",
  "nickname": "SleepyCat",
  "token": "jwt-token"
}
```

Validation:

- email must be valid
- password must meet minimum security requirements
- nickname must not be empty
- email must be unique

Security:

- password must be hashed before storage

---

### POST /api/auth/login

Logs in an existing user.

Authentication: Not required.

Request body:

```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

Response:

```json
{
  "userId": "string",
  "email": "user@example.com",
  "nickname": "SleepyCat",
  "token": "jwt-token"
}
```

---

## Dashboard API

### GET /api/me/summary

Returns dashboard data for the authenticated user.

Authentication: Required.

Response:

```json
{
  "todayCheckedIn": true,
  "todayStatus": "onTime",
  "currentStreak": 5,
  "longestStreak": 8,
  "koalaMood": "calm",
  "cutoffTime": "00:00",
  "timezone": "Pacific/Auckland",
  "badges": [
    {
      "name": "First Sleep",
      "description": "Completed your first on-time bedtime check-in"
    }
  ]
}
```

---

## Check-in APIs

### POST /api/checkins

Creates today’s bedtime check-in.

Authentication: Required.

Request body:

```json
{
  "timezone": "Pacific/Auckland"
}
```

Response:

```json
{
  "checkInId": "string",
  "status": "onTime",
  "localCheckInDate": "2026-07-03",
  "currentStreak": 6,
  "koalaMood": "calm",
  "unlockedBadges": [
    "3-Day Koala Care"
  ]
}
```

Business rules:

- current timestamp is stored in UTC
- local date is calculated based on timezone
- user cannot check in more than once on the same local date
- check-in is `onTime` if local time is before or equal to cutoff time
- check-in is `late` if local time is after cutoff time

---

### GET /api/checkins/me

Returns the authenticated user’s check-in history.

Authentication: Required.

Response:

```json
[
  {
    "id": "string",
    "localCheckInDate": "2026-07-03",
    "status": "onTime"
  },
  {
    "id": "string",
    "localCheckInDate": "2026-07-04",
    "status": "late"
  }
]
```

Privacy:

- only returns the current user’s own records
- does not return other users’ check-in history

---

### DELETE /api/checkins/{id}

Deletes a check-in record owned by the authenticated user.

Authentication: Required.

Use case:

- user accidentally clicked the check-in button
- user wants to remove an incorrect record

Business rule:

- user can only delete their own check-in record

---

## Settings APIs

### GET /api/settings/me

Returns the authenticated user’s settings.

Authentication: Required.

Response:

```json
{
  "nickname": "SleepyCat",
  "cutoffTime": "00:00",
  "timezone": "Pacific/Auckland",
  "themePreference": "dark"
}
```

---

### PUT /api/settings/me

Updates user settings.

Authentication: Required.

Request body:

```json
{
  "nickname": "KoalaMoon",
  "cutoffTime": "23:45",
  "timezone": "Pacific/Auckland",
  "themePreference": "dark"
}
```

Response:

```json
{
  "nickname": "KoalaMoon",
  "cutoffTime": "23:45",
  "timezone": "Pacific/Auckland",
  "themePreference": "dark"
}
```

Validation:

- nickname must not be empty
- cutoff time must be valid
- timezone must be valid
- theme preference must be light, dark, or system

---

## Badge APIs

### GET /api/badges/me

Returns badges unlocked by the authenticated user and available locked badges.

Authentication: Required.

Response:

```json
{
  "unlocked": [
    {
      "name": "First Sleep",
      "description": "Completed your first on-time bedtime check-in",
      "unlockedAt": "2026-07-03T10:00:00Z"
    }
  ],
  "locked": [
    {
      "name": "One Week Calm",
      "description": "Complete 7 consecutive on-time bedtime check-ins"
    }
  ]
}
```

---

## Leaderboard API

### GET /api/leaderboard

Returns top users ranked by current streak.

Authentication: Optional or required depending on implementation.

Response:

```json
[
  {
    "rank": 1,
    "nickname": "KoalaMoon",
    "currentStreak": 12
  },
  {
    "rank": 2,
    "nickname": "SleepyCat",
    "currentStreak": 8
  }
]
```

Privacy:

This endpoint must not return:

- email
- exact check-in time
- timezone
- full check-in history
- late records
- password hash

---

## Error Response Format

Example:

```json
{
  "error": "DuplicateCheckIn",
  "message": "You have already checked in today."
}
```

Common errors:

- InvalidCredentials
- Unauthorized
- DuplicateCheckIn
- InvalidCutoffTime
- InvalidTimezone
- NotFound
