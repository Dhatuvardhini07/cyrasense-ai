# Design Brief

## Direction
CyraSense AI — A premium, intelligent women's health companion that feels warm, trustworthy, and human-centered through soft feminine aesthetics and semantic cycle phase coloring.

## Tone
Warm editorial elegance — refined care without clinical coldness. Combines serif sophistication (Lora) with geometric modernity (Satoshi) to feel both intelligent and approachable.

## Differentiation
Semantic calendar highlighting with bright, intentional phase colors (red for period, lilac for ovulation, green for fertile window) that convey medical clarity while maintaining warmth; input validation that responds with human-like reassurance rather than sterile error messages.

## Color Palette

| Token           | OKLCH             | Role                                      |
| --------------- | ----------------- | ----------------------------------------- |
| background      | 0.96 0.015 75     | Warm cream base                           |
| foreground      | 0.2 0.03 50       | Dark warm brown text                      |
| card            | 0.98 0.01 75      | Elevated content surfaces                 |
| primary         | 0.52 0.15 15      | Soft rose pink (buttons, headings)        |
| accent          | 0.65 0.18 25      | Warm coral for highlights & CTAs          |
| secondary       | 0.92 0.02 75      | Muted background sections                 |
| destructive     | 0.5 0.25 25       | Calendar period day (bright red)          |
| chart-1         | 0.5 0.25 25       | Period phase (red)                        |
| chart-2         | 0.65 0.15 310     | Ovulation phase (soft lilac)              |
| chart-3         | 0.6 0.18 145      | Fertile window (soft green)                |
| chart-4         | 0.92 0.02 75      | Non-fertile days (muted)                  |

## Typography

- Display: Lora — serif headings, onboarding titles, dashboard phase insight
- Body: Satoshi — UI labels, body text, input validation messages, daily guidance
- Scale: hero `text-4xl md:text-6xl font-bold tracking-tight`, section h2 `text-2xl md:text-3xl font-bold`, label `text-sm font-semibold tracking-wide`, body `text-base`

## Elevation & Depth

Soft layered surfaces: cream background with raised card surfaces (0.98 OKLCH), subtle warm shadows for depth. No sharp contrasts — all transitions feel gentle and welcoming.

## Structural Zones

| Zone       | Background          | Border          | Notes                                                |
| ---------- | ------------------- | --------------- | ---------------------------------------------------- |
| Header     | card (0.98)         | border subtle   | Navigation/branding, same warm tone                  |
| Content    | background (0.96)   | —               | Main dashboard, calendar, logging sections           |
| Sidebar    | background (0.96)   | border subtle   | Navigation menu, consistent with header             |
| Dashboard  | background (0.96)   | —               | Today's date, phase insight, supportive message      |
| Calendar   | card (0.98)         | border subtle   | Semantic phase colors: bright red, lilac, green      |
| Footer     | secondary (0.92)    | border subtle   | Settings, logout, privacy links                      |

## Spacing & Rhythm

Spacious layout (section gaps 3–4rem, card padding 1.5–2rem) creates breathing room. Micro-spacing uses 0.5rem increments for grouped inputs. Alternating secondary backgrounds (0.92) for every other section prevents visual fatigue.

## Component Patterns

- Buttons: rose primary (0.52) with cream foreground, hover darkens to (0.45). Coral accent variant for secondary CTAs.
- Cards: 12px border-radius, cream base (0.98), subtle warm shadows, hover lift effect.
- Badges: cycle phase uses semantic colors (chart-1, chart-2, chart-3); semantic labels use primary or accent.
- Inputs: light border (0.88), focus ring in primary rose, placeholder text in muted (0.5).

## Motion

- Entrance: gentle fade-in (200ms) for modals, cards, dashboard sections. Calendar loads with phase highlights staggered (50ms intervals).
- Hover: smooth color transition (300ms) on buttons/cards, subtle scale lift (1.02x) on interactive elements.
- Decorative: none — motion is functional and purposeful. No bounces or playful animations; conveys calm confidence.

## Constraints

- No generic blue or purple defaults. Rose + coral palette is non-negotiable.
- Calendar phase colors (red/lilac/green) must remain bright and distinguishable at a glance.
- Input validation messages must use warm, reassuring language ("Your entered details seem unusual. Please recheck...") rather than error jargon.
- All health guidance must include reasoning/explanation; never feel like generic AI responses.
- Serif headings (Lora) reserved for hero text, section titles, and daily messages to convey care & editorial trust.

## Signature Detail

Semantic calendar grid with intentional phase coloring — users instantly recognize period days (bright red), ovulation (soft lilac), fertile window (soft green), and other days (muted beige). The calendar becomes a visual language for health awareness, making data feel natural and human rather than technical.

