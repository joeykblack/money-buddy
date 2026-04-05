# Bills Helper Website Design Plan

## 1) Project Purpose

Create a calm, simple, step-by-step website that helps complete:
- monthly bill workflow,
- irregular bill workflows,
- annual tax workflow,
- and Vanguard contribution workflow.

The site should reduce stress by showing only the current step, with optional details when needed.

---

## 2) Design Principles

1. **One step at a time**
   - Show a single clear action per screen/panel.
2. **Simple language**
   - Short sentences, common words, clear labels.
3. **Math without pressure**
   - User enters balances; app does all math.
4. **Progress visibility**
   - Show checklist/progress bar so completion feels clear.
5. **Optional detail**
   - “Why this matters” and “Show calculation” toggles.
6. **Kind visual feedback**
   - Success states, encouraging microcopy, cute rewards.
7. **No overload**
   - Avoid large walls of text and avoid showing every process at once.

---

## 3) Scope from bills.md

### Monthly Core Flow
1. Enter balances:
   - VyStar checking
   - VyStar savings
   - Citi
2. Calculate:

$$
\text{result} = \text{checking} - \text{citi} - 4000
$$

3. Decision path:
   - If result < 0: move from savings to checking.
   - If result > 0 and savings < 70,000: move to savings.
   - If result > 0 and savings >= 70,000: move to Vanguard.
4. Pay Citi card (target early month; usually due by 9th).

### Other Bills
- Boardman Lawn Care (end of month, ~$160, paid via Zelle)
- Happy Lawns/Integrity Lawn (email-triggered, ~$94)
- Mercury Car Insurance (Feb 1 + Aug 1, ~$2,000)

### Taxes + Annual Tasks
- Tax filing due by April 15
- Gather W-2, VyStar 1099-INT, Vanguard 1099-DIV
- Use FreeTaxUSA
- Check Roth IRA AGI eligibility and contribute max if eligible

### Auto Bills Reference
- Keep this as a collapsible reference section grouped by account (checking vs Citi).

### Vanguard Contribution Logic
- Add new money only; do not rebalance
- Settlement fund target: $30,000
- User enters one total contribution amount and app returns exact dollar suggestions per fund.
- Allocation targets:
  - VTSAX 50%
  - VTIAX 30%
  - VBTLX 15%
  - VTABX 5%

---

## 4) Information Architecture

## Main Navigation (top tabs)
1. **Today**
   - shows alerts + suggested next action
2. **Monthly Bills Walkthrough**
3. **Other Bills Walkthroughs**
4. **Taxes & Annual Tasks**
5. **Vanguard Helper**
6. **History**
7. **Settings** (themes, reward toggles)

## Home/Today Panel
- “What should I do now?” card
- Upcoming alerts (next 30/60 days)
- Resume button for unfinished walkthrough

---

## 5) Interaction Model

## Walkthrough Pattern (shared)
Each walkthrough uses the same frame:
1. **Step title**
2. **One action to do now**
3. **Input fields (if needed)**
4. **Primary button**: Continue
5. **Optional toggles**:
   - Show explanation
   - Show full calculation
6. **Completion state**:
   - Confetti-lite animation or cute image card

## Input UX Rules
- Large labels and fields
- Currency formatting while typing
- Inline validation with plain-language prompts
- Example placeholders: “Example: 5234.67”

---

## 6) Alerts and Date Logic

## Alert types
- **Soon**: due in 14 days
- **Coming up**: due in 30 days
- **Overdue/urgent**: due date passed or today

## Initial due-date set
- Citi: monthly, target pay window starts on 1st; due around 9th
- Mercury: Feb 1 and Aug 1
- Taxes: Apr 15
- Boardman: end of each month reminder
- Happy Lawns: manual “bill received” toggle (since date is irregular)

## Reminder behavior
- Show badges on Today page
- Sort by urgency
- One-click “Start this walkthrough” from each alert

---

## 7) Rewards + Themes

## Themes dropdown
- Light
- Soft Dark
- Garden
- Ocean
- Sunset

(Theme is persisted in localStorage.)

## Reward ideas
- Cute animal or plant image after finishing a workflow
- Rotating reward images so repeats feel fresh
- Optional “streak” indicator for monthly completion

---

## 8) Data and Persistence (No Backend)

Use localStorage for:
- theme selection,
- walkthrough progress,
- completion timestamps,
- full long-term history for all workflows and checklist actions,
- user-entered recurring due-date preferences,
- alert dismissals.

No sensitive account credentials stored.

---

## 9) Accessibility + Usability Requirements

- Keyboard-friendly controls
- High contrast for all themes
- Minimum 16px text body
- Clear focus states
- Avoid timed interactions
- Avoid cluttered layouts
- Mobile-first responsive layout

---

## 10) File/Implementation Plan

Planned docs structure:
- docs/index.html
- docs/styles.css
- docs/app.js
- docs/data/bills-config.js (optional)
- docs/assets/rewards/*

Recommended JS modules (phase 2 if needed):
- walkthrough engine
- calculations
- alerts scheduler
- persistence helpers

---

## 11) Delivery Phases

## Phase 1 — MVP
- Basic layout + navigation
- Monthly walkthrough with calculator decisions
- Core alert panel (taxes, mercury, citi)
- One or two themes
- One reward image on completion
- Full history logging enabled from day one (local only)

## Phase 2 — Complete Coverage
- Full walkthroughs for all sections in bills.md
- Better alerts and snooze/dismiss handling
- Vanguard helper details
- More themes + reward gallery

## Phase 3 — Polish
- Better microcopy
- Stronger progress/history view
- Optional print-friendly checklist mode

---

## 12) Confirmed Decisions

1. Repo / Pages target: joeykblack/money-buddy → https://joeykblack.github.io/money-buddy/
2. Theme selection details are deferred for now.
3. Keep full long-term history for everything (saved locally).
4. No password/PIN lock needed (not used on shared devices).
5. Vanguard helper will output exact per-fund dollar suggestions from one total input.
