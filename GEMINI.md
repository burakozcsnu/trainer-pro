# Batoner Mobile App Studios — Gemini Edition

Mobile app development run through coordinated Gemini CLI subagents.
Each agent owns a specific domain and follows the studio's collaboration
protocol, optimized for **Gemini CLI** capabilities.

## Technology Stack (Trainer Pro)

- **Platforms**: iPadOS (PWA) / Web
- **Approach**: Hybrid / SPA
- **Languages**: JavaScript / HTML5 / CSS3 (Batoner Studio Standards)
- **Backend**: Supabase (PostgreSQL + Storage)
- **CI/CD**: GitHub Pages + GitHub Actions

## Project Structure

- `.agent/docs/`: Studio Standards (Technical Preferences, Coding Standards)
- `.agent/`: Gemini Configuration & Local Rules
- `index.html`: Entry Point
- `script.js`: Core Logic
- `style.css`: Pro-Styling

## Collaboration Protocol (Gemini Mode)

**Autonomous execution ENABLED.**
Gemini CLI is authorized to:
- Execute all changes, migrations, and deployments autonomously without confirmation.
- Perform SQL Migrations on Supabase.
- Push changes to `main` to trigger the GitHub Pages deployment workflow.
- Refactor code according to Batoner Studio Standards.

## Studio Guidelines

- **iPad-First**: Target touch size min 44px. Use standalone mode.
- **Redundancy Zero**: Only relevant tab content must be visible.
- **Pro-Insights**: Show last performance data contextually.

@.agent/docs/coding-standards.md
@.agent/docs/technical-preferences.md

