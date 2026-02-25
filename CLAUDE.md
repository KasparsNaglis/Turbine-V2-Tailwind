# Turbine V2 — Claude Code Guide

## Stack

- **Framework**: Next.js (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 — native classes only, no inline `style={{}}` props except for dynamic values (gradients, calculated positions)
- **Font**: Geist via `next/font/google` — set once on the root container via `font-[family-name:var(--font-geist-sans)]`, never repeated on child elements
- **Icons**: `@heroicons/react/20/solid` — always use the 20px solid variant
- **Component library**: Catalyst UI kit (Tailwind UI) — components live in `src/components/catalyst/`
- **Dev server**: runs in Docker (`docker-compose up`)

## File Conventions

- Components go in `src/components/`
- Pages go in `src/app/`
- Figma asset exports go in `src/assets/figma-import/` — delete this folder before each `get_design_context` call to avoid overwrite errors

## Implementing from Figma

Figma working file: `https://www.figma.com/design/SGLWsyUwEJMgIRkafk471o/turbine-v2--Copy-`

Use the `figma:implement-design` skill. Steps:
1. Delete `src/assets/figma-import/` before calling `get_design_context`
2. Fetch design context + screenshot
3. Translate to project conventions (see below) — do not copy Figma's raw output verbatim

### Figma → Tailwind translation rules

| Figma token | Tailwind equivalent |
|---|---|
| `var(--milk/milk-100, rgba(245,245,245,0.06))` | `bg-white/[0.06]` |
| `var(--milk/milk-150, rgba(245,245,245,0.10))` | `bg-white/[0.10]` |
| `var(--milk/milk-600, rgba(245,245,245,0.64))` | `text-white/60` |
| `var(--milk/milk, #f5f5f5)` | `text-white` |
| `var(--mint/mint, #22e8e9)` | `text-[#22e8e9]` |
| `var(--font-size/md, 16px)` | `text-base` |
| `var(--font-size/base, 14px)` | `text-sm` |
| `var(--font-size/xs, 13px)` | `text-[13px]` |
| `var(--font-weight/medium, 500)` | `font-medium` |
| `var(--font-weight/regular, 400)` | `font-normal` |

## Design Patterns

### Tables / grids
- Use `border-separate border-spacing-y-px` (not `border-collapse`) to get 1px gaps between rows
- Add a dark background (`bg-[#0d0d10]`) to the container so the gaps read as subtle separators
- Row backgrounds: unselected `bg-white/[0.06]`, selected `bg-white/[0.10]`, hover `bg-white/[0.08]`

### Selection indicator
- Figma uses an absolutely-positioned gradient pill (4px × 50px)
- Gradient: `linear-gradient(-88.5deg, rgb(246,209,221) 18.27%, rgb(174,194,209) 49.04%, rgb(246,209,221) 82.69%)`
- Position is calculated dynamically based on selected row index — account for header height, row height, gap size, and pill height

### Dark theme palette
- Page background: `bg-zinc-950`
- Card/surface: `bg-white/[0.06]` (semi-transparent on dark)
- Muted text: `text-white/60`
- Accent: `#22e8e9`

## Rules

- No inline `style={{}}` unless the value is dynamic or a complex gradient not expressible in Tailwind
- No `font-family` on individual child elements — set once on the root container
- No guessing — if something is unclear, ask rather than assume
- Keep components simple: no over-engineering, no speculative abstractions
