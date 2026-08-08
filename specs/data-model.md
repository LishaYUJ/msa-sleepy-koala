# Data Model

## Overview

The backend database stores users, settings, bedtime check-ins, badges, and user badge unlocks.

Detailed check-in records are private and can only be accessed by the owning user. Public leaderboard data is limited to nickname and current streak.

## Entity: User

Stores basic account information.

| Field | Type | Notes |
|---|---|---|
| id | Guid / int | Primary key |
| email | string | Unique, private |
| passwordHash | string | Hashed password only, never store plaintext password |
| nickname | string | Public display name for leaderboard |
| createdAt | DateTime | Account creation time |

## Entity: UserSettings

Stores user-specific settings.

| Field | Type | Notes |
|---|---|---|
| id | Guid / int | Primary key |
| userId | Guid / int | Foreign key to User |
| cutoffTime | TimeOnly / string | User’s bedtime cutoff time, e.g. 00:00 |
| timezone | string | IANA timezone, e.g. Pacific/Auckland |
| updatedAt | DateTime | Last settings update time |

## Entity: SleepCheckIn

Stores each bedtime check-in event.

| Field | Type | Notes |
|---|---|---|
| id | Guid / int | Primary key |
| userId | Guid / int | Foreign key to User |
| checkInTimeUtc | DateTime | Actual click timestamp stored in UTC |
| localCheckInDate | DateOnly / string | Local date after timezone conversion |
| status | string | onTime / late |
| createdAt | DateTime | Record creation time |

## SleepCheckIn Privacy Rule

SleepCheckIn records are private.

A user can only access their own check-in history. The backend must filter check-in queries by the authenticated user’s ID.

## Entity: Badge

Defines available achievement badges.

| Field | Type | Notes |
|---|---|---|
| id | Guid / int | Primary key |
| name | string | Badge name |
| description | string | User-facing explanation |
| unlockCondition | string | Logical condition or internal key |
| iconName | string | Optional UI icon reference |

Example badges:

| Badge | Unlock Condition |
|---|---|
| First Sleep | First on-time check-in |
| 3-Day Koala Care | 3 consecutive on-time check-ins |
| One Week Calm | 7 consecutive on-time check-ins |
| Comeback Koala | On-time check-in after a broken streak |

## Entity: UserBadge

Stores which badges have been unlocked by each user.

| Field | Type | Notes |
|---|---|---|
| id | Guid / int | Primary key |
| userId | Guid / int | Foreign key to User |
| badgeId | Guid / int | Foreign key to Badge |
| unlockedAt | DateTime | Unlock timestamp |

## Derived Values

Some values can be calculated rather than stored permanently.

| Value | Source |
|---|---|
| currentStreak | Calculated from recent SleepCheckIn records or cached on UserStats |
| koalaMood | Derived from today’s status and recent streak pattern |
| leaderboardRank | Derived from current streak ranking |

## Optional Entity: UserStats

If performance or API simplicity becomes important, current streak can be cached in a separate table.

| Field | Type | Notes |
|---|---|---|
| id | Guid / int | Primary key |
| userId | Guid / int | Foreign key to User |
| currentStreak | int | Current consecutive on-time check-ins |
| longestStreak | int | Best streak achieved |
| lastCheckInDate | DateOnly / string | Last local check-in date |
| updatedAt | DateTime | Last stats update time |

## Leaderboard Privacy Model

The leaderboard response should only expose:

- rank
- nickname
- currentStreak

The leaderboard must not expose:

- email
- exact check-in time
- timezone
- full check-in history
- late check-in records
- password hash

## Relationship Summary

- One User has one UserSettings.
- One User has many SleepCheckIns.
- One User has many UserBadges.
- One Badge can belong to many users through UserBadge.
