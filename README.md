# Money Buddy Bills Helper

A simple, friendly website that walks through monthly bills and money-management steps.

## Site Link

- GitHub Pages URL: https://joeykblack.github.io/money-buddy/
- Local published entry point: [docs/index.html](docs/index.html)

## Goal

Build a low-stress, step-by-step bills assistant that:
- breaks tasks into small actions,
- performs all required math automatically,
- explains why each step matters in plain language,
- gives timely reminders for upcoming due dates,
- and adds fun touches (themes + completion rewards).

## Source of Truth

The billing logic and processes come from [info/bills.md](info/bills.md).

## Design Documentation

See [info/DESIGN_PLAN.md](info/DESIGN_PLAN.md).

## Planned Tech Stack

- HTML
- CSS
- Vanilla JavaScript
- Hosted from `docs/` on GitHub Pages

## MVP Status

MVP is now implemented in [docs/index.html](docs/index.html) with:

1. Today dashboard + date-based alerts.
2. Monthly step-by-step walkthrough with automatic math.
3. Other bills and taxes walkthrough checkoffs.
4. Vanguard helper with exact per-fund dollar outputs.
5. Local history tracking for all completed actions.
6. Placeholder theme selector (Light + Soft Dark).

## Run Locally

This is a static site (no build step).

1. Open a terminal.
2. Change into the docs folder.
3. Run a local Python server.

```bash
cd docs
python3 -m http.server 8000
```

Then open http://localhost:8000 in your browser.
