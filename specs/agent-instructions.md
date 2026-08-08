# AI Agent Instructions and Development Context

This file records the standing constraints used while collaborating with AI coding tools on Sleepy Koala. It complements the individual prompt summaries in `ai-prompts.md`.

## Product context supplied to the agent

- Sleepy Koala is a gamified bedtime-intention tracker, not a medical sleep detector.
- The koala is the emotional centre of the experience; streaks, badges, energy hearts, progress history, and the leaderboard provide the measurable game loop.
- A sleep day crosses midnight. The 21:00-02:00 check-in window and the user's IANA timezone must be treated consistently.
- Detailed check-in information is private. Public leaderboard responses expose only rank, nickname, and streak.

## Implementation instructions supplied to the agent

- Preserve the React, TypeScript, Zustand, ASP.NET Core, EF Core, and relational database stack.
- Keep desktop and mobile behaviour responsive and visually consistent with the existing nighttime storybook style.
- Make focused changes without overwriting unrelated work or untracked design assets.
- Use EF Core migrations for schema changes; never rewrite applied migration history.
- Keep secrets out of source control and use environment variables for production configuration.
- Validate changes with frontend build, lint, unit tests, backend tests, migration checks, and deployment-oriented checks.
- Treat accessibility labels, keyboard behaviour, readable status messaging, and destructive-action confirmation as required UI states.
- Keep the repository README aligned with the official assessment and explicitly list only the three advanced requirements selected for marking.

## Review approach

AI output was not accepted solely because it compiled. Changes were reviewed against screenshots, API behaviour, database contents, test results, deployment health endpoints, and the assessment document. When generated suggestions conflicted with the product tone or caused responsive issues, they were revised through additional prompts and manual testing.
