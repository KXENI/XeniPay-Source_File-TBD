# Pastel Rail — Original Palette

Inspired by an airy pastel atmosphere and deep violet railway night. The active interface avoids blue and uses a muted rail violet for primary actions.

## Core

| Token | Hex | Role |
|---|---|---|
| `--ink-900` | `#191529` | Dark background |
| `--ink-800` | `#231E36` | Raised dark surface |
| `--ink-700` | `#302A47` | Dark borders / dividers |
| `--paper-0` | `#FBFAFF` | Light background |
| `--paper-50` | `#F3F2FC` | Tinted light surface |
| `--paper-100` | `#E6E4F5` | Light borders / dividers |

## Accents

| Token | Hex | Role |
|---|---|---|
| `--rail-500` | `#5B478A` | Primary CTA and accent |
| `--rail-400` | `#8F63EE` | Hover / glow |
| `--rail-100` | `#E6E4F5` | Subtle accent fill |
| `--violet-500` | `#8F63EE` | Secondary accent |
| `--violet-300` | `#C9B8F8` | Gradient partner |

## Pastel Sky

| Token | Hex |
|---|---|
| `--peach` | `#FFD3BF` |
| `--rose` | `#F8C2D8` |
| `--lilac` | `#D6CBF7` |
| `--mint` | `#BFEBDC` |
| `--butter` | `#FBEBB0` |

## Forest

| Token | Hex |
|---|---|
| `--pine-900` | `#12302A` |
| `--pine-700` | `#235245` |
| `--moss-400` | `#74AB93` |

## Semantic

| Token | Hex |
|---|---|
| `--success` | `#3CCB8A` |
| `--warning` | `#F5B04A` |
| `--danger` | `#F2677A` |

## Text

| Theme | Foreground | Muted |
|---|---|---|
| Light | `#191529` | `#5E5A78` |
| Dark | `#F3F1FB` | `#A19DB9` |

## Gradients

```css
--grad-sky: linear-gradient(180deg, #D6CBF7 0%, #F8C2D8 55%, #FFD3BF 100%);
--grad-night: radial-gradient(120% 80% at 50% 0%, #302A47 0%, #191529 70%);
--grad-dusk: linear-gradient(180deg, #5B478A 0%, #8F63EE 50%, #191529 100%);
--glow-accent: radial-gradient(60% 60% at 50% 50%, rgba(91, 71, 138, .38), transparent 70%);
```

## CSS variables

The canonical variables live in `src/app/globals.css`. Legacy `--sky-*` names remain there only as compatibility aliases to the rail-violet values; they no longer render blue. Components should use these tokens or transparent derivatives made with `color-mix()` rather than introducing new hex values.
