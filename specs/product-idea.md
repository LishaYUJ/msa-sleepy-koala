# Product Idea

## Project Name

**Sleepy Koala**

## One-line Description

Sleepy Koala is a gamified bedtime check-in web application that encourages users to build an earlier sleeping habit through streaks, badges, koala mood changes, and a privacy-aware leaderboard.

## Problem

Many people intend to sleep earlier but lose track of time at night. Traditional habit trackers can feel passive because they only record behaviour after it happens. Sleepy Koala focuses on creating a simple bedtime commitment moment: when the user is ready to sleep, they click a button. And the koala will turn into meditation mode, with the meditation music to help user sleep.

## Core Idea

Instead of asking users to manually submit sleep duration or exact sleep time, the app records a bedtime check-in action.

The user sets a personal bedtime cutoff time (between 9:00 PM and 12:00 AM). When they click **“I’m going to sleep”** during the check-in window (9:00 PM to 2:00 AM), the system records the current timestamp and checks whether the action happened before or after the user’s cutoff time based on their local timezone.

The app then updates:

- today’s check-in status
- current early-sleep streak
- koala mood
- unlocked badges
- leaderboard ranking

## Gamification Elements

The application applies gamification through:

- **Streaks**: users build a continuous early-sleep check-in streak.
- **Badges**: users unlock achievements for consistent behaviour.
- **Koala mood system**: the koala visually reacts to the user’s bedtime consistency.
- **Leaderboard**: users can compare their current streak with other users.
- **Progress feedback**: users can see whether their habit is improving over time.

## Koala Mood Concept

The koala acts as an emotional feedback layer, driven by a Fatigue Score and Consecutive Bad Days logic.

Example states:

| Koala Fatigue State | Trigger |
|---|---|
| Healthy Koala | User checks in on-time, maintaining high fatigue score and 0 bad days |
| Weak Koala | User checks in late or misses a check-in, increasing bad days |
| Very Weak Koala | User repeatedly checks in late or misses check-ins, causing severe fatigue |

## Scope Clarification

This project is not a medical sleep tracking app. It does not claim to detect actual sleep onset, sleep stages, or sleep quality.

The app records **bedtime intention** rather than verified sleep behaviour. The goal is to support habit formation using playful and motivational feedback.

## Future Enhancement Ideas

The following ideas are considered future work and are not part of the MVP:

- wearable heart-rate detection
- Apple Health or Google Fit integration
- push notifications
- AI sleep coaching
- unlockable koala cosmetics
- friend system
- richer sleep analytics

## Relevance to MSA Gamification Theme

Sleepy Koala fits the gamification theme because it integrates game design elements such as streaks, badges, achievements, progress tracking, avatar feedback, and a leaderboard into a non-game habit-building application.
