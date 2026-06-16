# Product

## Register

product

## Users

Small friend group (3 people) studying Japanese together for JLPT N5→N3. Primary context: mobile, daily 15–30 min sessions, often on-the-go or in short bursts. They check each other's streaks and leaderboard rankings as social accountability. Mixed commitment levels — one serious (daily 30 min), one casual (10 min when bored), one deep-diver (45–60 min).

## Product Purpose

A structured JLPT learning app that makes daily Japanese study feel rewarding and social. N5 content is bundled offline (hiragana, katakana, kanji, vocab, grammar). Progress syncs to a backend so friends can see each other's streaks and compete on a leaderboard. Success = users complete N5 in 8–12 weeks, maintain a 14+ day streak, and keep each other accountable.

## Brand Personality

Playful, energetic, social. The app should feel like opening a game, not cracking a textbook. Streaks and leaderboards are front and center. Completing a lesson should feel satisfying — a small celebration, not a solemn checkbox.

## Anti-references

- **No Duolingo-green gamification** — avoid the bright lime-green color, cartoon owl mascots, and childish reward animations. The gamification is there but more refined.
- **No dark hacker aesthetic** — this is a bright, social study app, not a dev tool.
- **No flat/generic SaaS look** — no cream backgrounds, no hero metric cards, no identical card grids. Color should carry identity.
- **No Japanese kitsch** — no cherry blossoms, torii gates, or samurai imagery as decoration.

## Design Principles

1. **Progress is the reward** — every interaction should visibly advance something (streak, lesson count, leaderboard position). Never feel like treading water.
2. **Social energy over solo grind** — friends' activity is always a tap away. The leaderboard is a feature, not a buried setting.
3. **Content first, chrome second** — kanji and vocabulary should dominate the screen. UI elements support without competing.
4. **Delight at the right moments** — celebrate lesson completion, streak milestones, leveling up. Silence everywhere else.
5. **Mobile-native feel** — full-bleed layouts, large tap targets (≥44px), swipe gestures where natural. No web-app-on-a-phone compromises.

## Theming

Two themes: light (default) and dark. System preference respected on first launch; user can override in Profile settings.

**Light:**
- primary:  oklch(0.62 0.18 46)   — coral-orange
- accent:   oklch(0.52 0.19 283)  — indigo-violet
- bg:       oklch(1.000 0.000 0)  — pure white
- surface:  oklch(0.97 0.004 46)  — card bg
- ink:      oklch(0.15 0.015 46)  — body text
- muted:    oklch(0.55 0.008 46)  — secondary text

**Dark:**
- primary:  oklch(0.68 0.18 46)   — coral-orange (lifted for dark bg)
- accent:   oklch(0.62 0.19 283)  — indigo-violet (lifted)
- bg:       oklch(0.10 0.000 0)   — near-black
- surface:  oklch(0.15 0.006 46)  — card bg with barely-warm tint
- ink:      oklch(0.96 0.005 46)  — near-white
- muted:    oklch(0.55 0.008 46)  — secondary text

## Accessibility & Inclusion

WCAG AA minimum (4.5:1 body text contrast, 3:1 large text). Both themes verified for contrast. Reduced-motion support for all animations. Min tap target 44×44px per Apple HIG. All interactive elements labeled for screen readers.
