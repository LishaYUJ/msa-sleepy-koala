# AI Prompts and Development Notes

## Purpose

This file records how AI was used during project planning and development. It should be updated throughout the project, not only at the end.

## Prompt 1: Project Idea Evaluation

### Prompt Summary

I asked ChatGPT to evaluate whether a gamified anti-late-night app with a koala mascot would fit the MSA Phase 2 gamification theme.

### Key Outcome

The idea was refined into a gamified bedtime habit tracker.

Important decisions:

- The app should focus on bedtime intention rather than actual sleep detection.
- The koala mascot can provide emotional feedback.
- Streaks, badges, and leaderboard features make the idea more clearly gamified.
- Heart-rate detection should be future work because it adds complexity and privacy concerns.

---

## Prompt 2: MVP Scope

### Prompt Summary

I asked what should be included in the MVP and whether the mascot should be the main focus.

### Key Outcome

The MVP should focus on the complete habit loop:

1. user logs in
2. user sets cutoff time
3. user clicks “I’m going to sleep”
4. app determines on-time or late status
5. streak updates
6. koala mood updates
7. badges unlock
8. leaderboard updates

The mascot should support the experience but not become the main technical dependency.

---

## Prompt 3: Meaning of Streak

### Prompt Summary

I asked what a streak means in this project.

### Key Outcome

A streak means the number of consecutive days the user checked in before the cutoff time.

Example:

| Day | Status | Streak |
|---|---|---|
| Monday | onTime | 1 |
| Tuesday | onTime | 2 |
| Wednesday | late | 0 |
| Thursday | onTime | 1 |

---

## Prompt 4: Badge and Reward Mechanism

### Prompt Summary

I asked whether badges need to unlock additional rewards, such as koala cosmetics.

### Key Outcome

Badges alone are sufficient for the MVP achievement system.

Unlockable cosmetics can be listed as future work because they require additional asset management, UI, database design, and testing.

---

## Prompt 5: Leaderboard and Privacy

### Prompt Summary

I asked whether a leaderboard based on consecutive early-sleep days would count as gamification and whether storing user sleep data was appropriate.

### Key Outcome

The leaderboard is a valid gamification element.

Privacy decision:

- detailed check-in records remain private
- leaderboard only shows nickname and current streak
- leaderboard does not show email, timezone, exact check-in time, or full history

---

## Prompt 6: State Management Library

### Prompt Summary

I asked what a state management library means and whether it refers to storing all users’ sleep data.

### Key Outcome

State management refers to frontend state management, not database storage.

Zustand can be used to manage:

- current user
- today’s check-in status
- current streak
- koala mood
- badges
- leaderboard
- theme preference

---

## Prompt 7: Advanced Requirements

### Prompt Summary

I asked whether advanced requirements should be included in the MVP.

### Key Outcome

Advanced requirements should be included from the start.

Selected advanced requirements:

1. Zustand state management
2. Security measures: password hashing, authorization, and data validation
3. Theme switching

---

## Prompt 8: Development Order

### Prompt Summary

I asked whether to create Figma designs first or start with backend development.

### Key Outcome

Recommended development order:

1. low-fidelity Figma and planning documents
2. backend core models and APIs
3. frontend pages and Zustand integration
4. theme switching
5. unit tests
6. deployment
7. README, specs, and video preparation

---

## Future AI Usage to Record

During development, add more entries for:

- API design prompts
- EF Core model prompts
- authentication debugging prompts
- Zustand store design prompts
- unit test generation prompts
- UI copywriting prompts
- README improvement prompts
- deployment debugging prompts
