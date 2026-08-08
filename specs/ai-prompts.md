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

---

## Prompt 7: Advanced Requirements

### Prompt Summary

I asked whether advanced requirements should be included in the MVP.

### Key Outcome

Advanced requirements should be included from the start.

Selected advanced requirements:

1. Zustand state management
2. Security measures: password hashing, authorization, and data validation
3. Dockerization

---

## Prompt 8: Development Order

### Prompt Summary

I asked whether to create Figma designs first or start with backend development.

### Key Outcome

Recommended development order:

1. low-fidelity Figma and planning documents
2. backend core models and APIs
3. frontend pages and Zustand integration
4. unit tests
5. Dockerization
6. deployment
7. README, specs, and video preparation

---

## Prompt 9: Persistent profile avatar

### Prompt excerpt

> 在后端实现换头像的逻辑，并且让前端跟它相连。

### Key outcome

- Added validated avatar persistence to the authenticated settings API and database.
- Added image cropping/compression in the browser and avatar display in desktop and mobile navigation.
- Added integration coverage proving the avatar remains after a new login.

---

## Prompt 10: Koala energy and progress relationship

### Prompt excerpt

> Koala energy 是我们判断它本身是否按时签到的情况的反应……我想要不把它换成一个一个爱心……my progress 要怎么样能够有更有逻辑地跟这个主页上的考拉联系起来？

### Key outcome

- Replaced an ambiguous percentage meter with ten energy hearts.
- Made the koala itself the entry point to an explanatory energy panel.
- Kept detailed weekly history in My Progress while showing immediate emotional feedback in the sanctuary.

---

## Prompt 11: Responsive dashboard debugging

### Prompt excerpt

> 手机宽度下的 Koala Energy 需要下滑才能看到全部，而且在手机尺寸下显得有点太大了，有什么方案？

### Key outcome

- Added a compact mobile energy interaction and responsive spacing.
- Fixed weekly tracker overflow and protected the check-in control from bottom-navigation overlap.
- Preserved the original greeting until the user intentionally opens koala status.

---

## Prompt 12: Theme requirement replacement

### Prompt excerpt

> 现在 Light 跟 Dark mode 的切换非常不明显，我想把这个去掉。如果把这个去掉，然后再加一个另外的以上这些里面 advanced requirements 的话，你建议加哪一个？

### Key outcome

- Removed theme switching from the UI, Zustand state, API contract, EF model, and documentation.
- Added a provider-safe migration that removes the obsolete database field.
- Replaced the selected advanced requirement with Dockerization.

---

## Prompt 13: Assessment compliance audit

### Prompt excerpt

> 检查一下是否要求都满足了，以及帮我上传到 git 目前的更改。

### Key outcome

- Audited the complete official assessment PDF rather than only the advanced-requirement excerpt.
- Identified and fixed missing Delete CRUD coverage and production Scalar exposure.
- Expanded the root README with deployment links, gamification, unique features, selected advanced requirements, AI usage, and self-reflection.
