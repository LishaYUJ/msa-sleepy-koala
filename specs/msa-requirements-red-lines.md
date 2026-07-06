# MSA 2026 Phase 2 Software Stream — Requirements, Red Lines, and Checklist

> Source: `2026 Phase 2 - Software Assessment.pdf` uploaded for this project.  
> Purpose: This document translates the assessment requirements into project constraints so the implementation does not drift away from what must be submitted.

---

## 1. Assessment Context

This project is for **Microsoft Student Accelerator 2026 Phase 2 — Software Stream**.

The required deliverable is a **full-stack web application** based on the theme of **Gamification**.

The application must demonstrate:

- React frontend development
- REST API/backend development using C# and .NET
- EF Core usage
- Database persistence
- CRUD operations
- Deployment
- Unit testing
- Git usage
- Responsible and documented AI-assisted development

---

## 2. Theme Requirement: Gamification

The project must clearly relate to **Gamification**.

Gamification means adding game design elements to a non-game application to improve engagement and motivation.

Examples of gamification elements include:

- Points
- Badges
- Achievements
- Streaks
- Leaderboards
- Progress tracking
- Reward systems
- Visual feedback

### Application relevance

For Sleepy Koala, the gamification connection should be explicit:

- Users click a bedtime check-in button.
- The system checks whether the user checked in before their chosen cutoff time.
- On-time check-ins build a streak.
- Streaks unlock badges.
- The koala mascot changes mood based on user consistency.
- A leaderboard ranks users by current early-sleep streak.

### Red line

The project must not look like a plain form-based tracker. It needs visible gamification features.

---

## 3. Basic Requirements — Must Not Be Missed

The assessment states that **all basic requirements are required**. Neglecting basic requirements may result in instant failure.

### 3.1 Backend Requirements

The backend must include:

- Built using **C# with .NET 10 or higher**
- Must use **Entity Framework Core**
- Must use **data persistence** with an SQL or NoSQL database
- Must implement at minimum **CRUD operations**
- Must show clear Git usage with regular commit history
- Must implement **unit tests** covering key backend components and functionality
- Must deploy the backend
- Must expose **Scalar API documentation UI instead of Swagger UI**

### Backend red lines

Do not submit a backend that:

- Uses a language/framework other than C# and .NET
- Uses .NET 8 if the official requirement remains `.NET 10 or higher`
- Has no EF Core usage
- Has no database persistence
- Only uses in-memory data
- Has no CRUD functionality
- Has no backend unit tests
- Is not deployed
- Uses Swagger UI instead of Scalar API documentation UI

---

### 3.2 Frontend Requirements

The frontend must include:

- Built using **React with TypeScript** preferred
- JavaScript is allowed, but TypeScript is preferred
- Visually appealing and responsive UI
- Works nicely on both desktop and mobile
- If desktop-only, README must justify why it is not responsive
- Styling can use MUI, Mantine, Tailwind, custom CSS, or similar
- UI should reflect original design choices and have a unique visual identity
- Navigation using React Router or a similar routing library
- Clear Git usage with regular commit history
- Frontend deployment
- Unit tests covering key frontend components and functionality

### Frontend red lines

Do not submit a frontend that:

- Is not React-based
- Has no routing/navigation
- Looks like a generic unstyled template
- Is not deployed
- Has no frontend unit tests
- Is not responsive and has no README justification
- Has no clear visual identity or gamified UI elements

---

## 4. Advanced Requirements — Minimum Three

The application must contain **at least three advanced requirements** from the official list.

The README must clearly list the advanced requirements implemented. The markers will only mark the top three advanced features explicitly listed in the README.

### Official advanced requirement options

- Integrate all UI components with Storybook
- Implement security measures: minimum two with justification
  - Authorisation / RBAC
  - Anti-CSRF measures
  - Password hashing
  - Data validation / sanitisation
  - Rate limiting
- Use a state management library, e.g. Zustand or Redux
- Support theme switching, e.g. light/dark mode
- Dockerize the project using Docker
- Implement WebSockets
- End-to-end testing using Cypress
- Performance tests, system logging, and metrics
- Multiplayer functionality support
- Caching strategy and API optimisation techniques

### Recommended advanced requirements for Sleepy Koala

The recommended top three are:

1. **State management library: Zustand**
   - Manage auth state, today’s check-in status, streak, koala mood, badges, leaderboard data, and theme preference.

2. **Security measures**
   - Password hashing
   - JWT authorization
   - Data validation / sanitisation
   - README must explain why these matter and how they were implemented.

3. **Theme switching**
   - Light/dark mode.
   - Especially relevant because this is a bedtime app used at night.

### Advanced feature red lines

Do not:

- Leave advanced requirements until the final day.
- Implement advanced features but forget to list them in README.
- List more than three as the main marked features unless the top three are clearly prioritised.
- Claim a security feature without explaining its importance and implementation.

---

## 5. README Requirements

The repository must contain a README file with:

- Link to deployment
- Brief introduction to the project
- Section explaining how the project relates to the Gamification theme
- Section explaining what interesting features make the project unique and worth highlighting
- Clear checklist of advanced features implemented
- Self-reflection: what would be done differently if the project were repeated

### README red lines

Do not submit without:

- Deployment link
- Gamification explanation
- Advanced features checklist
- Self-reflection
- Clear project introduction

The advanced features must be explicitly listed because only the top three listed in the README will be marked.

---

## 6. `/specs` Folder Requirements

The repository must contain a `/specs` folder with `.md` files.

The folder should contain evidence of:

- Planning
- Design
- AI-assisted development
- AI prompt files
- Agent instructions
- Context/config files
- Prompts used during development, not just final code

### Recommended `/specs` structure for Sleepy Koala

```text
/specs
  product-idea.md
  mvp-scope.md
  user-flow.md
  data-model.md
  api-design.md
  advanced-requirements.md
  design-decisions.md
  test-plan.md
  ai-prompts.md
  msa-requirements-red-lines.md
```

### `/specs` red lines

Do not:

- Leave `/specs` empty.
- Only include final polished documentation.
- Omit prompts used during development.
- Pretend AI was not used if it was used.
- Let `/specs` contradict the actual implementation.

---

## 7. AI Usage Requirements

AI tools such as ChatGPT, GitHub Copilot, Microsoft Copilot, Claude, and similar tools may be used.

AI can support:

- Research
- Planning
- Coding
- Testing
- Debugging
- Documentation

However, the developer must critically evaluate AI output and demonstrate understanding of implemented solutions.

The submission must briefly describe how AI was used during development.

### AI usage red lines

Do not:

- Blindly copy AI-generated code without understanding it.
- Omit AI usage documentation.
- Only save final code prompts.
- Hide the fact that AI supported planning or debugging.
- Let AI-generated specs describe features that were not actually implemented.

### Suggested AI documentation approach

In `ai-prompts.md`, record:

- Prompt or summary of prompt
- Purpose of the prompt
- Output summary
- What was accepted
- What was changed or rejected
- Why the final decision was made

---

## 8. Submission Requirements

The submission form is expected to ask for:

- Link to public GitHub repository containing both frontend and backend
- Link to public video
- Optional text field for secrets or marking information that should not be public

The GitHub repository must contain:

- Frontend code
- Backend code
- README
- `/specs` folder
- Relevant tests
- Commit history

### Repository red lines

Do not:

- Submit separate GitHub links for frontend and backend.
- Submit a private or inaccessible repository.
- Put frontend and backend in separate repos.
- Forget deployment links.
- Commit after the deadline.

---

## 9. Video Requirements

The video must be public and should be no longer than **6 minutes**.

The video should include:

### Part 1: AI usage

Explain and show how AI was used during development.

Examples:

- Project planning discussion
- API design support
- Debugging support
- Unit test planning
- UI/mascot prompt generation
- README/specs drafting

### Part 2: Design decisions

Explain design decisions made during the project.

Examples for Sleepy Koala:

- Why the app records bedtime intention instead of actual sleep onset
- Why wearable heart-rate detection is future work
- Why leaderboard only shows nickname and streak
- Why badges are MVP rewards and mascot cosmetics are future work
- Why Zustand was selected
- Why Controllers were selected for backend API structure

### Video red lines

Do not:

- Exceed 6 minutes.
- Only show the app without explaining AI usage.
- Forget to explain design decisions.
- Use an inaccessible video link.

---

## 10. Git Usage Requirements

The assessment states that commit history may be checked.

Regular commits are important evidence of development process.

### Recommended commit pattern

Commit after each meaningful step:

```text
Initialize backend project structure
Add EF Core models and DbContext
Add authentication endpoints
Implement bedtime check-in logic
Add leaderboard endpoint
Initialize React frontend
Add Zustand stores
Build dashboard UI
Add badge and leaderboard pages
Add theme switching
Add backend unit tests
Add frontend unit tests
Update README and specs
Deploy frontend and backend
```

### Git red lines

Do not:

- Submit with only one final commit.
- Commit after the deadline.
- Commit secrets such as JWT keys, database passwords, or API tokens.

---

## 11. Sleepy Koala MVP Compliance Checklist

### Core product functionality

- [ ] User can register
- [ ] User can log in
- [ ] User can set cutoff time
- [ ] User can set or store timezone
- [ ] User can click “I’m going to sleep”
- [ ] Backend records check-in timestamp in UTC
- [ ] Backend determines on-time or late using user timezone and cutoff time
- [ ] Current streak is calculated and displayed
- [ ] Koala mood is calculated and displayed
- [ ] Badges can be unlocked and displayed
- [ ] Leaderboard displays nickname and current streak only

### Backend compliance

- [ ] C# backend
- [ ] Required .NET version according to official spec
- [ ] EF Core
- [ ] Database persistence
- [ ] CRUD operations
- [ ] Scalar API documentation UI
- [ ] Backend deployed
- [ ] Backend unit tests

### Frontend compliance

- [ ] React frontend
- [ ] TypeScript preferred
- [ ] React Router or similar routing
- [ ] Responsive UI
- [ ] Visually appealing and unique design
- [ ] Frontend deployed
- [ ] Frontend unit tests

### Advanced requirements

- [ ] Zustand state management
- [ ] Security measures: password hashing
- [ ] Security measures: JWT authorization
- [ ] Security measures: data validation / sanitisation
- [ ] Theme switching
- [ ] README clearly lists top three advanced features

### Documentation and submission

- [ ] README includes deployment link
- [ ] README explains gamification theme
- [ ] README highlights unique features
- [ ] README includes advanced feature checklist
- [ ] README includes self-reflection
- [ ] `/specs` folder exists
- [ ] `/specs` contains AI prompts and planning evidence
- [ ] Public GitHub repo link ready
- [ ] Public video link ready
- [ ] Video under 6 minutes

---

## 12. Important Risk Notes

### Risk 1: .NET version mismatch

The uploaded assessment file states `.NET 10 or higher` for the backend. Using `.NET 8` may be risky unless the official repository or updated instructions confirm otherwise.

Action:

- Verify the latest MSA GitHub repository instructions.
- If the requirement remains `.NET 10 or higher`, use the required version.

### Risk 2: Overbuilding mascot features

AI-generated mascot images, cosmetics, and room decoration systems can become time sinks.

Action:

- MVP should only include koala mood states.
- Cosmetic rewards should remain future work unless all core requirements are complete.

### Risk 3: Privacy issues with leaderboard

Sleep habits can be personal.

Action:

- Leaderboard should only expose nickname, rank, and current streak.
- Do not expose email, timezone, exact check-in times, or late history.

### Risk 4: Advanced requirements not documented

Even if implemented, advanced requirements may not be marked unless listed in the README.

Action:

- Add a clear advanced requirements checklist to README.
- Put the same list in `advanced-requirements.md`.

### Risk 5: Specs do not match implementation

Specs should evolve as the project changes.

Action:

- Update specs when implementation decisions change.
- Keep AI prompts and design decisions honest and project-specific.

---

## 13. Final Red-Line Summary

The project must not be submitted unless all of the following are true:

- Frontend and backend are both present in one public GitHub repository.
- Backend uses the required C#/.NET version, EF Core, database persistence, CRUD, deployment, tests, and Scalar API docs.
- Frontend uses React, routing, responsive UI, deployment, and tests.
- At least three advanced requirements are implemented and clearly listed in README.
- README includes deployment link, gamification explanation, unique features, advanced checklist, and self-reflection.
- `/specs` contains planning, design, AI prompts, and AI-assisted development evidence.
- Video is public, under 6 minutes, and explains AI usage and design decisions.
- Git commit history shows regular progress.
- No secrets are committed.
- No commits are made after the deadline.
