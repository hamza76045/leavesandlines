# Leafs & Lines — Redesign Specification

**Version:** 1.1 — *changed in 1.1: §2.7 splits the accent into navy fills and royal-blue text; §2.2/§2.4 token and contrast values updated; new dark-mode hover-ring rule in §2.4; D6 closed.*
**Date:** 2026-09-06
**Branch:** `codex/editorial-redesign`
**Stack:** Next.js 16.2.11 (App Router) · React 19.2.4 · Tailwind CSS v4 · react-pdf 10.4.1 / pdfjs-dist 6.1.200 · Supabase (blogs) · TypeScript 5

---

## 0. How to read this document

Sections 1–3 are **binding**: exact token values, type sizes, and rules. Implement them literally.
Sections 4–6 are **component and page specs** with required behaviour and layout intent.
Section 7 is the **defect register** — each item is a confirmed bug with a file reference.
Sections 8–10 are **accessibility requirements, QA gates, and work sequencing**.

Anything marked **MUST** is an acceptance criterion. Anything marked **SHOULD** is strongly recommended but may be traded off with sign-off. Open decisions are collected in §11.

> **Project rule reminder** — this repo pins Next.js 16. Per `AGENTS.md`, read the relevant guide in
> `node_modules/next/dist/docs/` before writing code. APIs differ from older versions.

---

## 1. Context and design intent

### 1.1 What this site is

A small, slow-publishing digital reading library: a handful of full-length books served as PDFs, plus a journal of essays. Content volume is expected to stay small — **under ~10 books and ~20 essays** for the foreseeable future. Layouts must therefore look *deliberately spare*, not *empty and waiting to be filled*.

### 1.2 Who it is for

**The primary audience is senior citizens.** This is the single most important constraint in this document and it overrides conventional editorial-web fashion wherever the two conflict.

Practical consequences, applied throughout:

| Principle | Consequence |
|---|---|
| Aging eyes need larger text | Base 18px, prose 20px, nothing below 15px anywhere |
| Contrast sensitivity declines with age | AA is the floor, AAA (7:1) the target for body text |
| Uppercase + letterspacing measurably slows reading | The 10px tracked-uppercase label system is removed entirely |
| Reduced fine motor control | 48×48px minimum hit targets, generous spacing between them |
| Icons without words are ambiguous | Every control carries a visible text label |
| Hover states don't exist on touch | No information may be hover-only |
| Hidden navigation is undiscoverable | Primary nav visible at every breakpoint; no hamburger |
| Users may not know they can change settings | Controls are labelled in words, defaults are the safe option |

### 1.3 Current state assessment

The `codex/editorial-redesign` branch replaced main's blue system with a green/terracotta "editorial magazine" treatment. It introduced one genuinely good idea (warm paper background) and several regressions: an unreadable dark mode, a micro-typography label system, three competing typefaces, and reader controls that are icon-only.

### 1.4 Decisions already taken

| Decision | Choice |
|---|---|
| Accent colour | **Blue**, restored from `main` — split by role: ink navy `#1e3a8a` for fills, royal blue `#1d4ed8` for text (see §2.7) |
| Background | **Warm paper** retained (`#f4f0e7`) — easier on aging eyes than white |
| Dark mode | **Kept**, but defaults to **light**, with a word-labelled toggle |
| Scope | **Visual system + accessibility + UX restructure** |
| Content scale | **Stays small** — design for sparse-but-intentional |
| Search | **Deferred** — see §11.3 |

---

## 2. Design tokens (binding)

### 2.1 Root cause being fixed

The current dark mode is broken because `--color-brand` performs two mutually incompatible jobs:

1. the **fill** behind white button text (needs to be *dark*), and
2. the **accent text colour** on the page background (needs to be *light* in dark mode).

`globals.css:66-69` papers over the collision with `.bg-brand { color: #ffffff !important }`. Measured result in dark mode:

| Element | Measured contrast | WCAG AA requires |
|---|---|---|
| White on `.bg-brand` | **1.63 : 1** | 4.5 : 1 |
| White on `.bg-brand-strong` (hover) | **1.37 : 1** | 4.5 : 1 |

Hovering makes it *worse*. This affects every primary CTA on the site.

**The fix is to split the token, not to tweak the colour.**

- `--color-brand` keeps its current job as the **accent text/border** colour. All 60 existing `text-brand` and 17 `border-brand` usages keep working unchanged and improve automatically.
- A new `--color-brand-fill` / `--color-brand-fill-hover` pair owns **button backgrounds**, always paired with white text.
- `.bg-brand { color: #fff !important }` and every `!text-white` override are **deleted**.

### 2.2 Complete token set

Replace the `:root` and `:root[data-theme="dark"]` blocks in `src/app/globals.css` with the following. Every value below has been contrast-verified; the verified ratios are in §2.4.

```css
:root {
  /* ---- Brand: blue, restored from main ---- */
  --blue-100: #dbeafe;
  --blue-200: #bfdbfe;
  --blue-300: #93c5fd;
  --blue-500: #2563eb;
  --blue-600: #1d4ed8;
  --blue-700: #1e40af;

  /* ---- Paper (warm) ---- */
  --paper:        #f4f0e7;
  --paper-warm:   #efeae0;   /* reader-warm surface */

  /* ---- Surfaces ---- */
  --color-bg:              #f4f0e7;
  --color-bg-soft:         #eae5da;
  --color-surface:         #faf8f2;
  --color-surface-raised:  #fffdf8;
  --color-surface-inset:   #e8e3d7;
  --color-border:          rgba(28, 25, 23, 0.16);
  --color-border-strong:   rgba(28, 25, 23, 0.28);

  /* ---- Text (warm neutrals, not slate) ---- */
  --color-text:   #1c1917;
  --color-muted:  #44403c;
  --color-subtle: #57534e;

  /* ---- Brand roles ---- */
  --color-brand:            #1d4ed8;  /* accent TEXT, borders, active nav — royal blue */
  --color-brand-strong:     #1e40af;  /* accent text hover */
  --color-brand-soft:       #e3ebfb;  /* wash / selected background */
  --color-brand-fill:       #1e3a8a;  /* button BACKGROUND — ink navy, see §2.7 */
  --color-brand-fill-hover: #172554;  /* button hover — darkens, never lightens */
  --color-on-brand-fill:    #ffffff;  /* text on brand-fill */

  /* ---- Semantic ---- */
  --color-success: #15803d;
  --color-warning: #b45309;
  --color-danger:  #b91c1c;

  --shadow-soft: 0 22px 60px rgba(44, 37, 27, 0.14);
}

:root[data-theme="dark"] {
  --color-bg:              #1a1815;
  --color-bg-soft:         #211d19;
  --color-surface:         #24201c;
  --color-surface-raised:  #2c2722;
  --color-surface-inset:   #14110f;
  --color-border:          rgba(245, 240, 232, 0.16);
  --color-border-strong:   rgba(245, 240, 232, 0.30);

  --color-text:   #f5f0e8;
  --color-muted:  #d6d3d1;
  --color-subtle: #a8a29e;

  --color-brand:            #93c5fd;  /* light blue TEXT on dark paper */
  --color-brand-strong:     #bfdbfe;
  --color-brand-soft:       rgba(59, 130, 246, 0.20);
  --color-brand-fill:       #2563eb;  /* stays dark enough for white text */
  --color-brand-fill-hover: #1d4ed8;  /* DARKENS on hover — this is deliberate */
  --color-on-brand-fill:    #ffffff;

  --color-success: #4ade80;
  --color-warning: #fbbf24;
  --color-danger:  #fca5a5;

  --shadow-soft: 0 22px 60px rgba(0, 0, 0, 0.45);
}
```

**Note on the dark background.** The current dark background `#111713` is green-tinted — it was chosen to harmonise with the mint accent. Under a blue accent it reads muddy. `#1a1815` is a warm charcoal that matches the warmth of the cream paper without fighting the blue. If product prefers the original value, `#111713` is acceptable but the green cast will be visible against blue accents.

### 2.3 Tailwind theme mapping

Extend the `@theme inline` block (`globals.css:85-102`) with the new tokens so the utilities exist:

```css
@theme inline {
  /* ...existing mappings... */
  --color-brand-fill:       var(--color-brand-fill);
  --color-brand-fill-hover: var(--color-brand-fill-hover);
  --color-on-brand-fill:    var(--color-on-brand-fill);
  --color-border-strong:    var(--color-border-strong);
  --color-success:          var(--color-success);
  --color-warning:          var(--color-warning);
  --color-danger:           var(--color-danger);
  --font-sans:   var(--font-ui);
  --font-serif:  var(--font-reading);
  /* --font-display REMOVED — see §3.1 */
}
```

### 2.4 Verified contrast ratios

All values computed against the tokens above using the WCAG 2.x relative-luminance formula. **These are acceptance criteria** — if an implementation changes a token, it must be re-verified.

**Light theme (on `#f4f0e7`)**

| Pair | Ratio | AA | AAA |
|---|---|---|---|
| `--color-text` `#1c1917` | **15.38 : 1** | ✅ | ✅ |
| `--color-muted` `#44403c` | **8.63 : 1** | ✅ | ✅ |
| `--color-subtle` `#57534e` | **6.76 : 1** | ✅ | — |
| `--color-brand` `#1d4ed8` | **5.86 : 1** | ✅ | — |
| `--color-brand-strong` `#1e40af` | **7.36 : 1** | ✅ | ✅ |
| `--color-danger` `#b91c1c` | **5.69 : 1** | ✅ | — |
| White on `--color-brand-fill` `#1e3a8a` | **10.38 : 1** | ✅ | ✅ |
| White on `--color-brand-fill-hover` `#172554` | **14.71 : 1** | ✅ | ✅ |

**Dark theme (on `#1a1815`)**

| Pair | Ratio | AA | AAA |
|---|---|---|---|
| `--color-text` `#f5f0e8` | **≈15.3 : 1** | ✅ | ✅ |
| `--color-muted` `#d6d3d1` | **11.75 : 1** | ✅ | ✅ |
| `--color-subtle` `#a8a29e` | **6.94 : 1** | ✅ | — |
| `--color-brand` `#93c5fd` | **9.72 : 1** | ✅ | ✅ |
| `--color-brand-strong` `#bfdbfe` | **12.32 : 1** | ✅ | ✅ |
| White on `--color-brand-fill` `#2563eb` | **5.12 : 1** | ✅ | — |
| White on `--color-brand-fill-hover` `#1d4ed8` | **6.67 : 1** | ✅ | — |

> ⚠️ **Do not lighten the dark-mode button on hover.** `#3b82f6` with white text measures **3.68 : 1** and fails AA. The hover state must darken. This is counter-intuitive and will be flagged in review by anyone who doesn't read this note.

> ⚠️ **Dark-mode hover needs a ring.** Darkening the fill keeps the *text* legible but costs boundary contrast against the dark page: `#2563eb` on `#1a1815` is **3.42 : 1** at rest (passes SC 1.4.11) but `#1d4ed8` on `#1a1815` is only **2.63 : 1** on hover. Primary buttons in dark mode **MUST** therefore gain `outline: 2px solid var(--color-brand)` (`#93c5fd`) on `:hover` and `:focus-visible`, so the component boundary never drops below 3 : 1. Light mode does not need this — navy on cream is 12.94 : 1 at rest and on hover.

### 2.5 Token migration map

| Current usage | Count | Change to |
|---|---|---|
| `text-brand` | 60 | *unchanged* — now resolves to the new blue |
| `border-brand` | 17 | *unchanged* |
| `bg-brand-soft` | 17 | *unchanged* |
| `bg-brand` | 17 | **`bg-brand-fill text-on-brand-fill`** |
| `bg-brand-strong` | 13 | **`hover:bg-brand-fill-hover`** |
| `text-brand-strong` | 5 | *unchanged* |
| `!text-white` on brand buttons | 3 | **delete** |

Files requiring the `bg-brand` → `bg-brand-fill` migration:

```
src/app/page.tsx
src/app/books/page.tsx
src/app/books/[slug]/page.tsx
src/components/layout/PublicNav.tsx
src/components/reader/PdfReaderShell.tsx
src/components/blog/BlogEditor.tsx
src/components/admin/AdminShell.tsx
src/app/admin/page.tsx
src/app/admin/blogs/page.tsx
src/app/admin/categories/page.tsx
src/app/admin/login/page.tsx
```

### 2.6 Global CSS rules to delete or replace

| Location | Current | Action |
|---|---|---|
| `globals.css:66-75` | `.bg-brand, .bg-brand-strong { color: #fff !important }` + svg overrides | **Delete.** Superseded by `text-on-brand-fill`. |
| `globals.css:61-64` | `[data-theme="dark"] button:hover, a:hover { border-color: var(--color-brand) }` | **Delete.** Applies to *every* link on the page and causes surprise borders. Replace with explicit per-component hover styles. |
| `globals.css:137-140` | `::selection { background: var(--blue-200); color: var(--blue-900) }` | **Replace** with `background: var(--color-brand-soft); color: var(--color-text);` — theme-aware. |
| `globals.css:142-145` | `:focus-visible { outline: 3px solid rgba(37,99,235,0.36) }` | **Replace** — see §8.3. Current ring is translucent and fails 3:1 non-text contrast on some surfaces. |
| `globals.css:4-20` | Unused `--blue-*` / `--slate-*` scales | **Prune** to the six blues listed in §2.2. |

### 2.7 Accent policy — why fill and text are different blues

**One accent colour.** The terracotta secondary (`--color-accent: #c8563f` / `#ee8b73`) is **removed**. A single, consistently-applied accent is the largest single legibility gain available for this audience. Semantic colours (success/warning/danger) remain for admin state only and must never be used decoratively on the public site.

**That one accent is expressed as two blues, chosen by area — this is deliberate and must not be "simplified" back to a single value.**

| Role | Colour | Reasoning |
|---|---|---|
| Large filled areas (buttons) | Ink navy `#1e3a8a` | A saturated cobalt slab reads as an interface object pasted onto a page of warm paper. Navy on cream is a print pairing — it reads as *ink*. Also gains contrast: 10.38 : 1 vs 6.67 : 1. |
| Small text areas (links, active nav, eyebrows) | Royal blue `#1d4ed8` | Must stay unmistakably *blue*. Only ever a few words wide, so it never forms a saturated block. |

The second row is an **accessibility requirement, not a preference**. The lens of the eye yellows with age, reducing short-wavelength transmission and impairing blue discrimination specifically. A dark navy sitting beside dark warm-grey body text (`#44403c`) is measurably harder for an older reader to identify as a link than a brighter blue is. Link text therefore stays on the brighter side even though navy would score higher on raw contrast.

Both directions are covered because link underlines are mandatory in prose (§3.5) and the active nav state carries a border as well as colour (§5.1) — colour is never the sole signal.

**Dark mode inverts the logic.** On a dark page, navy would disappear, so `--color-brand-fill` stays at mid-blue `#2563eb` and `--color-brand` becomes *light* blue `#93c5fd`. Same principle — fill and text are picked independently for their own background — opposite direction.

---

## 3. Typography (binding)

### 3.1 Font families

**Remove Sora.** It is used in roughly four places, adds a third font payload, and renders article `<h2>` elements *lighter* than the body text beneath them — actively inverting the hierarchy.

| Role | Family | CSS variable | Loaded via |
|---|---|---|---|
| Reading + display | **Literata** | `--font-reading` | `next/font/google` |
| UI / labels / controls | **Manrope** | `--font-ui` | `next/font/google` |

Update `src/app/layout.tsx`:

- Delete the `Sora` import and the `sora` instance.
- Remove `${sora.variable}` from the `<html>` className.
- Remove `--font-display` from `@theme inline`.
- Replace all `font-display` utility usages with `font-serif`.

Both are variable fonts, so no `weight` array is needed (see `node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md`). Add `display: "swap"` to both font calls.

Known `font-display` usages to migrate: `globals.css:173` (`.editorial-prose` headings), `PdfReaderShell.tsx:241`, `books/page.tsx` (empty-shelf heading), plus admin. Grep for `font-display` before finishing.

### 3.2 Type scale

Root stays at `16px`. **Body default becomes `1.125rem` (18px).**

| Token | rem | px | Use |
|---|---|---|---|
| `text-xs` | 0.9375 | **15** | Absolute floor. Metadata only. Never smaller. |
| `text-sm` | 1 | 16 | Secondary metadata, footer legal |
| `text-base` | 1.125 | **18** | **Default body, nav, buttons, labels** |
| `text-lg` | 1.25 | 20 | Article prose, lede paragraphs |
| `text-xl` | 1.5 | 24 | Card titles, `h4` |
| `text-2xl` | 1.875 | 30 | Section headings, `h3` |
| `text-3xl` | 2.25 | 36 | Article `h2`, list-item titles |
| `text-4xl` | 3 | 48 | Page headings |
| `text-5xl` | 3.75 | 60 | Featured headings |
| `text-display` | `clamp(2.75rem, 6vw, 4.5rem)` | 44–72 | Hero only |

**MUST: nothing on the public site renders below 15px.**

### 3.3 The label system — removed and replaced

Every eyebrow, kicker, and metadata line currently uses `text-[10px] font-bold uppercase tracking-[0.15em–0.2em]`. This is the single largest contributor to the site feeling like a template, and it is the hardest text on the site to read.

**Replace every instance with:**

```
text-xs font-semibold text-subtle      /* 15px, sentence case, normal tracking */
```

No `uppercase`. No `tracking-[…]`. Sentence case, e.g. `Featured reading` — not `FEATURED READING · NO. 01`.

Known instances to fix:

| File | Line(s) | Content |
|---|---|---|
| `src/app/page.tsx` | 24, 35, 67, 78 | "Featured reading · No. 01", book meta, category/format, "The journal" |
| `src/app/blogs/page.tsx` | 20, 33, 43 | "The journal · 2026", "Featured essay", "N minute read" |
| `src/app/books/page.tsx` | 39, 55, 58 | "The library · Vol. 01", "On the shelf now", category |
| `src/app/blogs/[slug]/page.tsx` | 42, 49, 59 | "The journal · Essay", byline, "Read alongside" |
| `src/app/books/[slug]/page.tsx` | — | category eyebrow, spec-table labels |
| `src/components/blog/ArticleRow.tsx` | 23 | date + reading time |
| `src/components/layout/PublicNav.tsx` | 31, 41-44 | tagline, nav links |
| `src/components/layout/PublicFooter.tsx` | 38 | footer nav |

### 3.4 Per-component size changes

| Component | Element | Now | Becomes |
|---|---|---|---|
| `PublicNav` | nav links | 12px bold uppercase tracked | **18px medium, sentence case** |
| `PublicNav` | wordmark | 18px serif | 20px serif |
| `PublicNav` | tagline | 10px uppercase tracked | 15px, or remove |
| `page.tsx` | hero `h1` | `clamp(3.4rem, 8vw, 7.4rem)` | `clamp(2.75rem, 6vw, 4.5rem)` |
| `page.tsx` | description | 16px | **18px** |
| `page.tsx` | buttons | 14px, `h-12` | **18px, `h-14` (56px)** |
| `page.tsx` | section `h2` | 30/36px | 36px |
| `ArticleRow` | title | 24/30px | **30/36px** |
| `ArticleRow` | dek | 15px | **18px** |
| `ArticleRow` | date/meta | 12px uppercase | **15px sentence case** |
| `PublicFooter` | tagline | 14px | 18px |
| `PublicFooter` | nav | 12px uppercase | 18px sentence case |
| `PublicFooter` | legal | 14px | 16px |
| `blogs/[slug]` | dek | 20px serif | 22px serif |
| `blogs/[slug]` | byline | 12px uppercase | 16px sentence case |
| `books/page` | author | 18px | 20px |
| `books/page` | metadata | 14px | 16px |
| `PdfReaderShell` | book title | 14/16px | 18px |
| `PdfReaderShell` | page indicator | 12px | 16px |

The hero is currently top-heavy: the `h1` scales to 118px while everything beneath it sits at 15–16px, so the eye falls off a cliff. Reducing the hero and raising the body closes that gap from both ends.

### 3.5 Reading prose

Replace the `.editorial-prose` block in `globals.css`:

```css
.editorial-prose {
  color: var(--color-text);
  font-family: var(--font-reading), Georgia, serif;
  font-size: calc(1.25rem * var(--reading-scale, 1));  /* 20px base */
  line-height: 1.75;
  max-width: 34em;                                      /* ≈ 65–70 characters */
}

.editorial-prose > * + * { margin-top: 1.4em; }

.editorial-prose h2,
.editorial-prose h3,
.editorial-prose h4 {
  font-family: var(--font-reading), Georgia, serif;     /* was --font-display */
  font-weight: 600;
  line-height: 1.2;
  margin-top: 2em;
}

.editorial-prose h2 { font-size: 1.6em; }
.editorial-prose h3 { font-size: 1.3em; }
.editorial-prose h4 { font-size: 1.1em; }

/* REQUIRED — Tailwind v4 preflight strips list markers. See §7 defect D2. */
.editorial-prose ul { list-style: disc outside; padding-left: 1.4em; }
.editorial-prose ol { list-style: decimal outside; padding-left: 1.4em; }
.editorial-prose li { padding-left: 0.25em; }
.editorial-prose li::marker { color: var(--color-subtle); }
.editorial-prose li + li { margin-top: 0.6em; }

.editorial-prose a {
  color: var(--color-brand);
  text-decoration: underline;
  text-decoration-thickness: 0.08em;
  text-underline-offset: 0.18em;
}
.editorial-prose a:hover { color: var(--color-brand-strong); }

.editorial-prose blockquote {
  border-left: 4px solid var(--color-brand);
  font-size: 1.15em;
  line-height: 1.6;
  margin-left: 0;
  padding-left: 1.1em;
}
```

`--reading-scale` is set by the text-size control (§6.3).

---

## 4. Layout and spacing

### 4.1 Container widths

| Context | Max width |
|---|---|
| Site shell (nav, footer, index pages) | `1180px` — unchanged |
| Article reading column | `34em` (~680px at 20px) |
| Article page grid | `minmax(0, 1fr) 280px` — prose + sidebar |
| Reader page area | `980px` — unchanged |

### 4.2 Fixed-nav offset — currently inconsistent

`PublicNav` is `fixed` at `h-18` (72px). Pages compensate differently:

| Page | Current padding | Problem |
|---|---|---|
| `src/app/page.tsx:19` | `pt-18` (72px) | Content starts flush under the nav |
| `src/app/blogs/page.tsx:14` | `pt-28` (112px) | 40px more than home |
| `src/app/books/page.tsx:32` | `pt-28` | — |
| `src/app/blogs/[slug]/page.tsx:38` | `pt-28` | — |

**MUST:** define one value and use it everywhere. Nav height becomes **`h-20` (80px)** to accommodate 18px links at a 48px+ target size; every page uses **`pt-28`** (112px = 80px nav + 32px breathing room).

### 4.3 Vertical rhythm

Section spacing on index pages: `py-16` mobile / `py-24` desktop. Between list items: `py-8` minimum — the current `py-7`/`py-9` is too tight once titles grow to 30–36px.

### 4.4 Footer position on tall viewports

On a 1512×1200 display the Library page leaves ~150px between the last content and the footer, because `min-h-screen` + `flex-1` pushes it down. This is acceptable and should **not** be "fixed" by adding filler content. Content genuinely ends there.

**SHOULD:** give the footer more presence so it reads as a deliberate close rather than a stranded bar — see §5.3.

---

## 5. Component specifications

### 5.1 `PublicNav` — `src/components/layout/PublicNav.tsx`

**Remove the hamburger menu entirely.** There are two nav items. They fit on a 320px screen at 18px.

| Requirement | Spec |
|---|---|
| Height | `h-20` (80px), all breakpoints |
| Links | "Essays", "Library" — 18px, sentence case, no uppercase, no tracking |
| Link target | ≥48×48px including padding |
| Active state | `text-brand` + 2px `border-brand` underline. **MUST NOT** be colour-only — the border carries it for colour-blind users |
| Wordmark | Logo + "Leafs & Lines" at 20px serif |
| Tagline | Hide below `lg`, or remove entirely |
| Theme toggle | See §5.5 — must carry a visible text label |
| Mobile (<640px) | Wordmark on row 1; nav links + theme toggle on row 2. Two-row nav, nothing hidden |
| Background | `bg-bg/95 backdrop-blur-xl` — unchanged |
| Delete | `useState` for `mobileMenuOpen`, `Menu`/`X` imports, the entire mobile drawer block (lines 55–91) |

### 5.2 Buttons

Three variants only.

| Variant | Background | Text | Border | Height | Font |
|---|---|---|---|---|---|
| **Primary** | `bg-brand-fill` → `hover:bg-brand-fill-hover` | `text-on-brand-fill` | none (dark mode: 2px `--color-brand` ring on hover/focus — see §2.4) | `h-14` (56px) | 18px semibold |
| **Secondary** | `bg-surface` → `hover:bg-brand-soft` | `text-text` | `border-border-strong` | `h-14` | 18px semibold |
| **Quiet link** | none | `text-brand` → `hover:text-brand-strong` | none, underline on hover | `h-14` | 18px semibold |

**Rules**

- Minimum touch target **48×48px**; `h-14` (56px) is the standard for public-site buttons.
- Horizontal padding `px-7` minimum.
- Border radius: `rounded-full` for pills, consistently. Do not mix `rounded-lg` and `rounded-full` for the same role (currently inconsistent between nav, reader, and page CTAs).
- Icons are **decorative only** (`aria-hidden="true"`) and always accompanied by a text label.
- Adjacent buttons need ≥12px gap so a shaky tap doesn't hit the wrong one.
- **MUST NOT** use `!text-white` — the `text-on-brand-fill` token handles it.

### 5.3 `PublicFooter` — `src/components/layout/PublicFooter.tsx`

Currently a thin bar that adds nothing. Make it a proper close.

| Requirement | Spec |
|---|---|
| Background | `bg-bg-soft` with `border-t border-border` — visually distinct from page body |
| Padding | `py-16` |
| Columns | 1) wordmark + one-line description; 2) Essays / Library / (Continue reading, if progress exists); 3) copyright + Admin |
| Link size | 18px sentence case, ≥48px target |
| Admin link | Keep, but demote — 16px, `text-subtle`, bottom row |

### 5.4 `ArticleRow` — `src/components/blog/ArticleRow.tsx`

| Requirement | Spec |
|---|---|
| Title | 30px mobile / 36px desktop, serif semibold |
| Dek | **18px** (from 15px), `text-muted`, max 2 lines |
| Meta | **15px sentence case** (from 12px uppercase tracked) — `"12 July 2026 · 7 min read"` |
| Index number | Keep at 15px italic serif, `text-subtle` |
| Row padding | `py-8` minimum |
| **Whole row clickable** | The `<Link>` currently wraps only the `<h3>` (line 16–20). Wrap the entire row. A 30px title is not a big enough target. |
| Hover | `group-hover:text-brand` is fine, but **MUST NOT** be the only affordance — the title is always `text-text` and always visibly a link on focus |
| Focus | Visible ring on the whole row, not just the heading |

### 5.5 `ThemeToggle` — `src/components/theme/ThemeToggle.tsx`

Currently an unlabelled 44px icon button. For this audience that is not discoverable.

| Requirement | Spec |
|---|---|
| Label | Visible text: "Dark mode" / "Light mode" beside the icon. Not `aria-label` alone. |
| Size | ≥48px tall |
| Default | **Light.** See §7 defect D10. |
| Icon | Keep `Sun`/`Moon`, `aria-hidden="true"` |
| State | `aria-pressed` reflecting the current mode |

### 5.6 `BookCover` — `src/components/books/BookCover.tsx`

| Requirement | Spec |
|---|---|
| Aspect | `aspect-[405/551]` — unchanged |
| Ring | `ring-1 ring-black/10` is invisible on dark backgrounds. Use `ring-border` |
| Shadow | Hard-coded `rgba(15,23,42,0.18)` is a leftover cool slate. Use `shadow-[var(--shadow-soft)]` |
| Alt text | Currently duplicates the title in both `alt` and `aria-label` on the wrapper, so screen readers announce it twice. Keep `alt`, **remove** the wrapper's `aria-label` (line 14) |

### 5.7 Reader — `src/components/reader/PdfReaderShell.tsx`

This component needs the most work. It is the core of the product and currently the least usable part of it.

#### 5.7.1 Controls — all icon-only today, all must gain labels

| Control | Current | Required |
|---|---|---|
| Back | `ChevronLeft` icon, `history.back()` | **"Back to book"** with text, links to `/books/[slug]` (deep-link safe) |
| Pages panel | `PanelLeft` icon | **"Go to page"** with text |
| Zoom out | `Minus` icon | **"Smaller"** with text |
| Zoom in | `Plus` icon | **"Larger"** with text |
| Zoom level | `12px` percentage | **16px**, with a **"Reset"** action |
| Focus mode | `Maximize2` icon | **"Hide toolbar"** with text |
| Previous page | `ChevronLeft` icon | **"Previous"** with text |
| Next page | `ChevronRight` icon | **"Next"** with text |
| Theme | icon | See §5.5 |

All reader buttons: **≥56px tall**, ≥12px apart.

#### 5.7.2 Zoom

- Range **50% – 300%** (currently 65%–150%, far too narrow for low vision).
- Steps of 25%.
- **MUST** fix the double-scale bug: `<Page width={pageWidth} scale={zoom} />` multiplies both (line 253–258). Pass **`width` only**, computed as `containerWidth * zoom`, and drop the `scale` prop.
- Add a **"Fit width" / "Fit page"** pair, labelled in words.

#### 5.7.3 Scrolling

- **MUST remove `no-scrollbar`** from the page container (line 229). Hiding the scrollbar on a container that clips the PDF page leaves no cue that content continues below. This is the most serious usability defect in the reader.
- The scrollbar **MUST** be visible whenever the page overflows.

#### 5.7.4 Keyboard and touch

| Input | Action |
|---|---|
| `←` / `PageUp` | Previous page |
| `→` / `PageDown` / `Space` | Next page |
| `Home` / `End` | First / last page |
| `+` / `-` | Zoom |
| Swipe left / right | Next / previous page |

Keyboard handlers must not fire while focus is inside the page-number input.

#### 5.7.5 PDF worker — remove the CDN dependency

`PdfReaderShell.tsx:17` loads the worker from `https://unpkg.com/…`. One network failure, CSP change, or offline moment and the reader is a blank box.

**Required:** copy `node_modules/pdfjs-dist/build/pdf.worker.min.mjs` into `public/` and set:

```ts
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
```

Add a `postinstall` script so the file stays in sync with the installed `pdfjs-dist` version:

```json
"postinstall": "cp node_modules/pdfjs-dist/build/pdf.worker.min.mjs public/pdf.worker.min.mjs"
```

#### 5.7.6 Loading and error states

- `PdfReaderClient.tsx:11` hard-codes `bg-[#eaf1f8]` — a leftover cool blue that matches neither theme. Use `bg-bg text-muted`.
- Loading text 18px, not 14px.
- The error state (line 240–248) must offer a **"Download the PDF"** fallback link and a **"Back to book"** link, not just an apology.

#### 5.7.7 Page count

`numPages` from the loaded PDF (**401**) contradicts the mock metadata (**350**). The reader **MUST** display the value read from the PDF. See defect D6.

---

## 6. New features

### 6.1 Reading-position persistence

The site's own featured essay is titled *"Building a library that remembers where you left off."* The reader currently stores nothing — there is no `localStorage` usage in the reader at all.

**Storage key:** `ll.reading-progress.v1`

```ts
type BookProgress = {
  page: number;
  totalPages: number;
  zoom: number;
  fit: "width" | "page";
  updatedAt: string;        // ISO 8601
};

type ReadingProgressStore = Record<string /* bookId */, BookProgress>;
```

**Behaviour**

| Event | Action |
|---|---|
| Page / zoom / fit changes | Write, debounced 500ms |
| Reader opens | Restore `page`, `zoom`, `fit`. If restoring past page 1, show a dismissible bar: **"Resuming at page 47. Start from the beginning?"** |
| Storage unavailable / corrupt JSON | Fail silently to page 1. Never throw. |

Reads must be SSR-safe — gate on `typeof window !== "undefined"` or use `useSyncExternalStore` with a server snapshot, following the existing pattern in `src/app/books/page.tsx:13-19`.

### 6.2 "Continue reading" card

**Placement:** top of the homepage, above the featured book, only when progress exists for at least one book.

**Content:** cover thumbnail · title · **"You're on page 47 of 401"** · progress bar · primary button **"Continue reading"** · quiet link "Start over".

**Rules**

- Client-only; **MUST NOT** cause layout shift or a hydration mismatch. Render nothing on the server and on first client paint; reveal after mount.
- Progress bar needs `role="progressbar"` with `aria-valuenow` / `aria-valuemin` / `aria-valuemax`, and **MUST NOT** be the only indication of progress — the "page 47 of 401" text carries it.

### 6.3 Article text-size control

**Placement:** top-right of the article header on `/blogs/[slug]`.

**Control:** three labelled buttons — **A** (Normal) · **A** (Large) · **A** (Largest) — rendered at their actual relative sizes, with visible words beneath or accessible names "Normal text size" / "Large text size" / "Largest text size".

| Setting | `--reading-scale` | Effective prose size |
|---|---|---|
| Normal | `1` | 20px |
| Large | `1.15` | 23px |
| Largest | `1.3` | 26px |

**Storage key:** `ll.text-size.v1`, values `"1" | "1.15" | "1.3"`.

Applied by setting `--reading-scale` on the `.editorial-prose` container (see §3.5). Use `aria-pressed` on the active button. Persist across articles and sessions.

### 6.4 End-of-content next steps

Every page currently dead-ends. Add:

| Page | Add at end |
|---|---|
| `/blogs/[slug]` | Previous / next essay cards, "All essays" link, related book |
| `/books/[slug]` | "Read this book" repeated, "Back to the library" |
| `/blogs` | If more essays exist than shown — otherwise a quiet "That's everything for now" |
| `/books` | Same |

Sparse content is fine, but it must read as *finished*, not *broken*.

### 6.5 Label consistency

The same two destinations currently carry four different labels.

| Destination | Use everywhere |
|---|---|
| `/reader/[bookId]` | **"Read this book"** (replaces "Begin reading", "Open PDF") |
| `/books/[slug]` | **"About this book"** (replaces "About this edition", "About the book") |

---

## 7. Defect register

Each item below was confirmed by inspection of the running site at `localhost:3001` and the source. Severity: **S1** blocks release · **S2** must fix in this pass · **S3** fix if time allows.

| ID | Sev | Defect | Location | Fix |
|---|---|---|---|---|
| **D1** | S1 | White button text on pale mint = **1.63:1** contrast; **1.37:1** on hover. Affects every primary CTA in dark mode. | `globals.css:66-69`, `:54-56` | §2.1 token split |
| **D2** | S1 | Article bullet and numbered lists render with **no markers**. Tailwind v4 preflight strips `list-style`; `.editorial-prose ul/ol` only sets padding. | `globals.css:206-209` | §3.5 |
| **D3** | S1 | Reader hides its own scrollbar on a container that clips the PDF page — no cue that more content exists. | `PdfReaderShell.tsx:229` | §5.7.3 |
| **D4** | S1 | Reader stores no reading position. A 401-page book restarts at page 1 on every visit. | reader — no `localStorage` at all | §6.1 |
| **D5** | S2 | `<Page width={…} scale={…} />` multiplies both, so the displayed zoom percentage is meaningless and low zoom leaves wide dead bands. | `PdfReaderShell.tsx:253-258` | §5.7.2 |
| **D6** | ~~S2~~ | ~~Book metadata claims **350 pages**; the PDF has **401**.~~ **Mock corrected to 401.** The reader must still read `numPages` from the PDF rather than trusting metadata — see §5.7.7. | `src/lib/mock/books.ts:27` | ✅ mock fixed · §5.7.7 still applies |
| **D7** | S2 | PDF worker loaded from `unpkg.com`. Single point of failure for the core feature. | `PdfReaderShell.tsx:17` | §5.7.5 |
| **D8** | S2 | Primary nav hidden behind a hamburger below `lg`; "All essays" is `hidden sm:flex`. On a phone the homepage has **no visible path** to the essay list. | `PublicNav.tsx:36-70`, `page.tsx:81-87` | §5.1 |
| **D9** | S2 | Category shown as "Travelogue & Literature" in the eyebrow and "Travel writing" in the spec table on the same page. | `books/[slug]/page.tsx`, `mock/books.ts:25` | Single source of truth |
| **D10** | S2 | Theme follows the OS on first visit and the toggle is an unlabelled icon. | `layout.tsx:29-37` | Default `"light"`; §5.5 |
| **D11** | S2 | `[data-theme="dark"] a:hover { border-color }` applies to **every link** on the page. | `globals.css:61-64` | Delete; §2.6 |
| **D12** | S2 | `PdfReaderClient` loading state hard-codes `bg-[#eaf1f8]` — matches neither theme. | `PdfReaderClient.tsx:11` | §5.7.6 |
| **D13** | S3 | `::selection` uses `--blue-200`/`--blue-900` and the focus ring uses `rgba(37,99,235,…)` — orphaned blue left over from `main`. | `globals.css:137-145` | §2.6 |
| **D14** | S3 | Fixed-nav offset differs per page (`pt-18` vs `pt-28`). | §4.2 | One value everywhere |
| **D15** | S3 | `BookCover` announces its title twice (wrapper `aria-label` + image `alt`). | `BookCover.tsx:14,19` | Remove the wrapper `aria-label` |
| **D16** | S3 | `BookCover` ring is `ring-black/10` — invisible on dark backgrounds. | `BookCover.tsx:13` | `ring-border` |
| **D17** | S3 | `ArticleRow` link wraps only the `<h3>`; the rest of the row is not clickable. | `ArticleRow.tsx:16-20` | §5.4 |
| **D18** | S3 | Reader "Back" uses `history.back()`, which misbehaves on deep links. | `PdfReaderShell.tsx:64` | Link to `/books/[slug]` |
| **D19** | S3 | Three fonts loaded, one (Sora) barely used and inverting heading hierarchy. | `layout.tsx:14-17` | §3.1 |

---

## 8. Accessibility requirements

Target: **WCAG 2.2 Level AA**, with AAA contrast for body text where achievable.

### 8.1 Contrast

- Body and metadata text: **AA minimum (4.5:1)**, AAA (7:1) targeted — see §2.4.
- UI component boundaries, icons, focus rings: **3:1** minimum (SC 1.4.11).
- **MUST NOT** convey information by colour alone (SC 1.4.1) — active nav uses a border as well as colour; progress uses text as well as a bar.

### 8.2 Target size

WCAG 2.2 SC 2.5.8 requires 24×24px. **This project requires 48×48px** for all interactive elements, exceeding SC 2.5.5 (AAA, 44×44). Adjacent targets ≥12px apart.

### 8.3 Focus

Replace the current translucent ring:

```css
:focus-visible {
  outline: 3px solid var(--color-brand);
  outline-offset: 3px;
  border-radius: 2px;
}
```

**SC 2.4.11 (Focus Not Obscured)** — the site has a fixed 80px header. A focused element scrolled beneath it violates this. **MUST** add:

```css
:target, [id] { scroll-margin-top: 7rem; }
```

and verify by tabbing through every page from the top.

### 8.4 Zoom and reflow

- **SC 1.4.4** — usable at 200% browser zoom, no loss of content or function.
- **SC 1.4.10** — no horizontal scrolling at 320px width.
- **SC 1.4.12** — must survive user-injected text spacing (line-height 1.5×, letter-spacing 0.12em, word-spacing 0.16em, paragraph spacing 2×). Avoid fixed heights on text containers.

### 8.5 Semantics

- One `<h1>` per page; no skipped heading levels.
- All icons decorative → `aria-hidden="true"`; every control has a visible text label.
- Reader page-number input has a visible `<label>`, not just `aria-label`.
- Skip-to-content link as the first focusable element (currently missing site-wide).
- `prefers-reduced-motion` block at `globals.css:147-156` — keep as is, it's correct.

### 8.6 Language

`<html lang="en">` is correct for the UI. The Taj Mahal book is Urdu — book titles and any Urdu text **SHOULD** be wrapped in `lang="ur" dir="rtl"` where rendered as text.

---

## 9. QA acceptance checklist

Release is blocked until every box is checked.

**Contrast**
- [ ] Every token pair in §2.4 verified with a contrast checker in the built app
- [ ] Every primary button ≥4.5:1 in **both** themes, in **both** rest and hover states
- [ ] No element renders below 15px on any public page
- [ ] Axe DevTools: zero violations on `/`, `/blogs`, `/blogs/[slug]`, `/books`, `/books/[slug]`, `/reader/[bookId]`

**Keyboard**
- [ ] Every interactive element reachable by Tab, in logical order
- [ ] Focus ring visible on every element, on every surface, in both themes
- [ ] No focused element hidden under the fixed header (SC 2.4.11)
- [ ] Reader responds to `←` `→` `Home` `End` `+` `-`
- [ ] Skip-to-content link present and functional

**Responsive**
- [ ] 320px: no horizontal scroll on any page
- [ ] 320px: both nav links visible without a menu
- [ ] 200% browser zoom: all content and function available
- [ ] Tested at 320 / 390 / 768 / 1280 / 1512 / 1920

**Reader**
- [ ] Page position survives a hard refresh
- [ ] "Resuming at page N" bar appears and dismisses correctly
- [ ] Scrollbar visible whenever the PDF page overflows
- [ ] Zoom 50%–300%, percentage accurate to rendered size
- [ ] Page count matches the PDF (401), not the mock (350)
- [ ] Works with the network blocked after first load (local worker)
- [ ] Every control has a visible text label

**Content and consistency**
- [ ] Zero instances of `text-[10px]`, `uppercase tracking-[…]`, `font-display`, `!text-white` in `src/`
- [ ] Zero `bg-brand` without `text-on-brand-fill`
- [ ] "Read this book" / "About this book" used consistently
- [ ] Article lists render visible bullets and numbers
- [ ] No page dead-ends without a next step

**Themes**
- [ ] Light is the default on a fresh profile
- [ ] Theme toggle carries a visible word label
- [ ] Full visual pass of every page in both themes

---

## 10. Work sequence

Five commits, each independently reviewable and shippable.

| # | Commit | Contents | Est. |
|---|---|---|---|
| 1 | **Design tokens** | §2 in full — token split, blue restoration, warm-neutral text, delete the `!important` overrides and the global `a:hover` rule, token migration across all 11 files | 0.5 d |
| 2 | **Typography** | §3 in full — drop Sora, new scale, remove the uppercase label system, rewrite `.editorial-prose` (fixes D2), fix the nav-offset inconsistency | 1 d |
| 3 | **Navigation & components** | §5.1–5.6 — de-hamburger the nav, button system, footer, `ArticleRow`, `ThemeToggle`, `BookCover`; light default (D10) | 1 d |
| 4 | **Reader** | §5.7 in full + §6.1 — labels, zoom, scrollbar, keyboard, local worker, persistence. The largest single piece. | 2 d |
| 5 | **Continue reading & next steps** | §6.2–6.5 — homepage card, text-size control, end-of-page navigation, label unification | 1 d |

Commit 1 changes the appearance of the entire site at once, including admin. Expect a broad but shallow diff. Commits 2–5 narrow progressively.

**Admin pages** (`/admin/*`) inherit the token and typography changes automatically. They are **out of scope** for redesign but **in scope** for a visual regression check after commits 1 and 2 — they use `bg-brand` (see §2.5) and will break in the same way if the migration is partial.

---

## 11. Open decisions

These need a product answer before or during implementation. None block starting commit 1.

### 11.1 Brand spelling
The UI reads **"Leafs & Lines"**; the repository is `leavesandlines`. "Leafs" is not a standard plural of "leaf". On a site about reading, this is the kind of detail readers notice. **Recommend: change to "Leaves & Lines".** Affects `PublicNav.tsx:30`, `PublicFooter.tsx:25`, `blogs/[slug]/page.tsx:43`, `layout.tsx:25` (metadata title), `mock/blogs.ts:9` (`HARDCODED_AUTHOR`), `public/logo.svg` if it contains text.

### 11.2 Dark background value

*(Resolved for light mode: cream `#f4f0e7` confirmed, with the navy/royal-blue role split of §2.7.)*

§2.2 specifies `#1a1815` (warm charcoal) rather than the current `#111713` (green-tinted). Confirm the change or accept the green cast against blue accents.

### 11.3 Search
Deferred. With <10 books and <20 essays, a search box is a control that earns its keep on a site three times this size; making the full lists visible and well-ordered serves this audience better. Revisit at ~30 items. **Confirm this deferral.**

### 11.4 Reader paging model
This spec keeps **single-page view** with paging controls. Continuous vertical scroll is more natural for long-form reading but rendering 401 pages via react-pdf needs virtualisation, which is a materially larger piece of work. **Recommend: ship single-page now, evaluate continuous scroll after user feedback.**

### 11.5 Branch strategy
Confirm whether this work continues on `codex/editorial-redesign` or on a fresh branch cut from it.

### 11.6 Supabase configuration
No `.env` file exists locally, so `fetchPublishedPostsFromSupabase()` falls through to the mock data in `src/lib/mock/blogs.ts` on every call. Confirm whether Supabase is configured in the deployed environment — if the site is running on mock data in production, that is a separate issue outside this spec's scope, but it changes how the essay pages should be tested.

---

## Appendix A — Files affected

| File | Commits |
|---|---|
| `src/app/globals.css` | 1, 2 |
| `src/app/layout.tsx` | 2, 3 |
| `src/app/page.tsx` | 1, 2, 3, 5 |
| `src/app/blogs/page.tsx` | 1, 2, 5 |
| `src/app/blogs/[slug]/page.tsx` | 1, 2, 5 |
| `src/app/books/page.tsx` | 1, 2, 5 |
| `src/app/books/[slug]/page.tsx` | 1, 2, 5 |
| `src/components/layout/PublicNav.tsx` | 1, 2, 3 |
| `src/components/layout/PublicFooter.tsx` | 2, 3 |
| `src/components/blog/ArticleRow.tsx` | 2, 3 |
| `src/components/blog/BlogRenderer.tsx` | 2 (verify list rendering) |
| `src/components/books/BookCover.tsx` | 3 |
| `src/components/theme/ThemeToggle.tsx` | 3 |
| `src/components/theme/ThemeProvider.tsx` | 3 (default light) |
| `src/components/reader/PdfReaderShell.tsx` | 1, 4 |
| `src/components/reader/PdfReaderClient.tsx` | 4 |
| `src/lib/mock/books.ts` | 4 (page count, category) |
| `src/components/admin/*`, `src/app/admin/*` | 1 (token migration only) |
| `package.json` | 4 (`postinstall` worker copy) |
| `public/pdf.worker.min.mjs` | 4 (new) |

## Appendix B — Measurements taken

Recorded against the running site at `localhost:3001` on 2026-09-06, for reference during review.

| Measurement | Value |
|---|---|
| White on `--color-brand` (dark) | 1.63 : 1 |
| White on `--color-brand-strong` (dark, hover) | 1.37 : 1 |
| `--color-subtle` on `--color-bg` (light) | 4.47 : 1 |
| `--color-brand` on `--color-bg` (light) | 8.78 : 1 |
| Homepage document height @1440×900 | 1814px |
| Library content height @1512×1200 | 794px; footer gap 152px |
| PDF actual page count | 401 (metadata claims 350) |
| `text-brand` usages | 60 |
| `bg-brand` + `bg-brand-strong` usages | 30 |
