# Blue Editorial Design Language

This document defines the reusable design language for a blog and books app where users read articles and PDF books, while admins publish and manage content. Treat it as the source of truth for future implementations and eventual conversion into a Codex skill.

## Design Intent

The product should feel like a calm, premium reading workspace: part modern editorial publication, part Notion-style knowledge base, part focused PDF reader. The interface must prioritize reading comfort, content discovery, and admin publishing clarity over decorative marketing.

The main theme color is blue. Blue is used as a trust and navigation signal, not as a full-screen wash. The app should feel bright, sharp, and modern, with restrained surfaces, generous white space, precise typography, and subtle motion.

Primary inspiration:

- Notion: block-based hierarchy, quiet surfaces, clean databases, structured content metadata.
- Medium/Substack: comfortable long-form reading, author/date/category hierarchy, low-distraction article pages.
- Ghost/editorial publications: professional publishing structure, issue-like homepages, strong SEO and newsletter patterns.
- 2026 blog/web trends: minimal layouts, content-first pages, accessible navigation, smart personalization, subtle animation, bold but readable typography.

Sources reviewed for direction: Figma web design trends 2026, OptimizePress blog design trends, SiteBuilderReport blog design examples, Ghost, Notion Help Center, Notion brand guidelines article, Notion page design principles, Ghost theme marketplace, Colorlib Ghost blog examples.

## Brand Personality

Use these traits consistently:

- Clear: every screen should make the next action obvious.
- Literary: books and articles should feel respected, not treated like generic cards.
- Calm: avoid visual noise, heavy gradients, and crowded controls.
- Capable: admin tools should feel precise and efficient.
- Modern: use current interaction patterns, but avoid novelty that hurts readability.

Avoid:

- Purple/blue gradient SaaS styling.
- Oversized landing-page hero sections for logged-in product screens.
- Dense dark dashboards as the default reading experience.
- Decorative blob backgrounds, glassmorphism overuse, and floating card stacks.
- Blog layouts where everything is a card and nothing feels editorial.

## Color System

Use a light theme as the default. Support dark mode, but the product identity should be recognizable in both themes.

### Primitive Tokens

```css
:root {
  --blue-50: #eff6ff;
  --blue-100: #dbeafe;
  --blue-200: #bfdbfe;
  --blue-300: #93c5fd;
  --blue-400: #60a5fa;
  --blue-500: #2563eb;
  --blue-600: #1d4ed8;
  --blue-700: #1e40af;
  --blue-800: #1e3a8a;
  --blue-900: #172554;

  --slate-50: #f8fafc;
  --slate-100: #f1f5f9;
  --slate-200: #e2e8f0;
  --slate-300: #cbd5e1;
  --slate-500: #64748b;
  --slate-700: #334155;
  --slate-900: #0f172a;

  --ink: #111827;
  --paper: #fbfdff;
  --paper-warm: #f8faf7;
  --line: rgba(15, 23, 42, 0.11);
}
```

### Semantic Tokens

```css
:root {
  --color-bg: var(--paper);
  --color-bg-soft: #f3f7fb;
  --color-surface: #ffffff;
  --color-surface-raised: #ffffff;
  --color-surface-inset: #eef5ff;
  --color-border: var(--line);
  --color-text: var(--ink);
  --color-muted: #5f6f86;
  --color-subtle: #8793a5;
  --color-brand: var(--blue-600);
  --color-brand-strong: var(--blue-700);
  --color-brand-soft: var(--blue-50);
  --color-accent: #0891b2;
  --color-success: #14835f;
  --color-warning: #b7791f;
  --color-danger: #c2410c;
  --shadow-soft: 0 18px 50px rgba(15, 23, 42, 0.08);
}

:root[data-theme="dark"] {
  --color-bg: #07111f;
  --color-bg-soft: #0b1628;
  --color-surface: #101b2d;
  --color-surface-raised: #152238;
  --color-surface-inset: #0b1f3a;
  --color-border: rgba(219, 234, 254, 0.12);
  --color-text: #eef6ff;
  --color-muted: #b6c4d8;
  --color-subtle: #8798b0;
  --color-brand: #60a5fa;
  --color-brand-strong: #93c5fd;
  --color-brand-soft: rgba(37, 99, 235, 0.18);
  --shadow-soft: 0 22px 60px rgba(0, 0, 0, 0.28);
}
```

### Color Usage

- Use blue for primary buttons, active navigation, selected filters, links, PDF progress, focus rings, and admin publish states.
- Use cyan sparingly for secondary accents like reading stats, comments, or AI summaries.
- Use neutral surfaces for most content areas.
- Use warm paper only inside long-form reading and book preview contexts when it improves eye comfort.
- Never place long-form text on saturated blue backgrounds.

## Typography

Use a two-font system:

- Display/UI font: `Sora` or `Inter Tight` for headings, nav, labels, metrics, and buttons.
- Reading/body font: `Literata`, `Source Serif 4`, or `Charter` for article and book text.
- Utility/body UI fallback: `Manrope` or `Inter` for admin tables, forms, and metadata.

Recommended default:

```css
--font-ui: "Manrope", system-ui, sans-serif;
--font-display: "Sora", "Manrope", system-ui, sans-serif;
--font-reading: "Literata", Georgia, serif;
```

### Type Scale

- Hero title: 56-80px desktop, 40-48px mobile, line-height 0.96-1.05.
- Page title: 40-56px desktop, 32-40px mobile, line-height 1.05.
- Section heading: 24-32px, line-height 1.15.
- Card title: 18-22px, line-height 1.25.
- UI body: 15-16px, line-height 1.6.
- Reading body: 18-20px, line-height 1.75.
- Metadata: 12-14px, line-height 1.4.

Rules:

- Article width must stay between 640px and 760px.
- PDF reader controls can be compact, but never below 13px.
- Letter spacing is 0 except uppercase labels, which may use 0.12em.
- Do not use negative letter spacing in compact UI.
- Reading pages should favor serif body text; dashboards and admin screens should favor sans-serif.

## Layout System

Use a 12-column desktop grid with constrained content widths:

- App shell max width: 1280px.
- Editorial index max width: 1180px.
- Reading content width: 680-740px.
- PDF reader width: full available area with a persistent toolbar.
- Admin workspace max width: 1440px.

Spacing scale:

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
```

Structural rules:

- Use full-width bands for major sections, not nested cards.
- Use cards only for repeated content items, modals, admin panels, and book/article previews.
- Keep card radius at 8px unless the component is intentionally pill-shaped.
- Navigation can use rounded pills, but body content containers should be flatter and editorial.
- Every fixed-format UI element needs stable dimensions to avoid layout shift.

## Core Screen Structure

### Public Home

The home screen should open with the product itself: current featured article, featured book, or editorial collection. Do not use a generic marketing hero.

Recommended structure:

1. Top navigation with logo, Blog, Books, Categories, Search, Account/Admin.
2. Editorial lead: one large featured article or book with title, summary, cover image, category, reading time, and clear CTA.
3. Continue reading row for signed-in users.
4. Latest essays grid.
5. Featured books shelf.
6. Topic collections.
7. Newsletter or account CTA as a restrained band.

### Blog Index

Use a Notion-like content database feel without looking like a raw table.

Required parts:

- Search input with keyboard focus clarity.
- Category tabs or segmented filters.
- Sort menu: Latest, Popular, Short reads, Long reads.
- Featured article row.
- Article list with title, dek, author, date, reading time, category, and optional thumbnail.
- Empty state with suggested topics.

Article list style:

- Prefer horizontal editorial rows for most posts.
- Use image cards only for featured content.
- Keep metadata compact and predictable.

### Article Reading Page

The reading page is the most important public surface.

Structure:

- Minimal top nav.
- Article header: category, title, subtitle/dek, author, date, reading time.
- Optional cover image below header.
- Sticky reading progress bar.
- Main article column, 680-740px.
- Optional right rail on desktop for table of contents, share, bookmark, and related book.
- Related articles at the bottom.

Reading rules:

- Body text must be comfortable at 18-20px with 1.7-1.8 line height.
- Paragraph spacing should be 1.1-1.35em.
- Links are blue with underline on hover.
- Pull quotes can use a left blue rule and larger serif text.
- Code blocks use neutral slate surfaces and monospace 14px.

### Books Library

The books area should feel like a curated shelf, not a generic product grid.

Structure:

- Header with search, topic filters, reading level, and format.
- Featured book strip with cover, description, author, length, and progress if signed in.
- Book shelf grid using stable cover aspect ratio: 2:3.
- Metadata below cover: title, author, category, pages, status.
- States: Not started, In progress, Completed, Saved.

Book cover treatment:

- Covers should be sharp, inspectable, and large enough to identify.
- Use subtle shadow and 6px radius.
- Never crop covers into decorative hero backgrounds.

### PDF Reader

The PDF reader must feel focused and tool-like.

Desktop structure:

- Top toolbar: back, title, page count, search, zoom, theme, bookmark, notes.
- Left rail: thumbnails or table of contents.
- Center canvas/document area.
- Right rail: notes, highlights, related article/book details.
- Bottom or top page controls depending on available width.

Mobile structure:

- Single-column document viewport.
- Collapsible toolbar.
- Bottom sheet for thumbnails, notes, and search results.
- Large hit areas for page navigation.

Reader rules:

- Use blue for current page, progress, active note, and search match.
- Background behind PDF should be slate/blue-gray, not pure black.
- Toolbar must remain legible in dark and light themes.
- Support distraction-free mode that hides side rails and secondary controls.

### Admin Dashboard

Admin surfaces should be dense, structured, and low-decoration.

Structure:

- Sidebar or top workspace nav: Dashboard, Blogs, Books, Uploads, Categories, Media, Users, Settings.
- Main list views with table/list toggle.
- Status chips: Draft, Review, Scheduled, Published, Archived.
- Primary action: New Blog or Upload Book.
- Editor layout: metadata/settings rail plus content/editor area.

Admin visual style:

- Use sans-serif only.
- Use compact rows, clear borders, and restrained blue active states.
- Avoid marketing-like cards.
- Forms should have labels above fields, helper text below, and consistent validation states.

## Components

### Buttons

- Primary: solid blue, white text, 44px minimum height.
- Secondary: white/surface background, slate border, blue hover state.
- Tertiary: text or icon button with blue hover/focus.
- Destructive: muted red/orange, never blue.

Button radius:

- Primary CTAs: 999px or 8px depending on placement.
- Admin and tool buttons: 8px.
- Icon buttons: square 40x40 or 44x44.

### Cards

Article card:

- Title, summary, metadata, optional thumbnail.
- 8px radius, 1px border, no heavy shadow by default.
- Hover: border shifts toward blue, title color becomes blue.

Book card:

- Cover image at 2:3.
- Metadata below, not overlaid.
- Progress bar only when relevant.

Admin card/panel:

- Flat surface, 1px border, small header, compact controls.

### Tags and Chips

- Category chips use blue-soft background and blue text.
- Status chips use semantic colors.
- Filters should be segmented controls or checkable chips.
- Avoid too many colored tag variants; color should communicate meaning.

### Navigation

- Desktop nav: quiet, sticky top bar with subtle blur or solid surface after scroll.
- Mobile nav: drawer or bottom sheet, not cramped horizontal overflow.
- Active nav uses blue text plus a subtle soft-blue background.
- Search should be globally accessible from the nav.

### Search

Search is a first-class component:

- Large command-palette style overlay for global search.
- Results grouped by Articles, Books, Authors, Categories.
- Highlight matched text.
- Include recent searches or continue-reading shortcuts for signed-in users.

### Empty States

Empty states should be useful, not cute:

- One short heading.
- One explanatory sentence.
- One next action.
- Optional suggested topics or upload CTA.

## Imagery

Use imagery as content, not decoration.

- Blog thumbnails should relate directly to the article topic.
- Book covers should be displayed clearly and consistently.
- Author avatars can be small and circular.
- Avoid abstract stock imagery unless the article itself is abstract.
- Do not blur or darken primary reading assets.

For generated imagery:

- Use crisp editorial illustration, photographic realism, or book-cover style depending on context.
- Keep palettes compatible with blue, slate, white, and restrained cyan.
- Avoid purple gradients and generic AI-glow visuals.

## Motion

Motion should support orientation:

- Page transitions: 180-280ms fade/translate.
- Hover transitions: 120-180ms.
- PDF page transitions: fast and functional, no page-flip gimmicks by default.
- Command palette: 120ms fade/scale.
- Respect `prefers-reduced-motion`.

Use motion for:

- Progress updates.
- Saving/publishing feedback.
- Reader toolbar reveal/hide.
- Search overlay entry.

Avoid motion for:

- Long article body content.
- Repeated card animations that delay scanning.
- Decorative background movement.

## Accessibility

Baseline requirements:

- WCAG AA contrast for all text and controls.
- Visible focus rings using brand blue.
- 44px minimum touch targets for public/mobile controls.
- Keyboard navigation for search, filters, PDF controls, editor actions.
- Reader font-size controls.
- Theme controls for light, dark, and warm reading modes.
- Alt text for article images and book covers.
- Preserve semantic headings in articles and admin forms.

Reading accessibility:

- Let users adjust font size, line height, and theme.
- Do not justify body text.
- Keep line length between 60 and 85 characters.
- Provide table of contents for long posts and books where available.

## Responsive Behavior

Mobile:

- Single-column reading and index pages.
- Sticky bottom or top controls only when they do not obscure content.
- Book cards can use a two-column grid if covers remain readable.
- Filters collapse into a sheet.

Tablet:

- Two-column book grids.
- Optional right rail can collapse below content.

Desktop:

- Use side rails for reading context and PDF tools.
- Keep reading column narrow even on wide screens.
- Admin screens may use full width for tables and bulk actions.

## Content Voice

UI copy should be direct and calm.

Use:

- "Continue reading"
- "Save to library"
- "Upload book"
- "Publish article"
- "Schedule post"
- "Reading progress"
- "Open PDF"

Avoid:

- Hype-heavy copy.
- Over-explaining features inside the UI.
- Cute empty state language.
- Long button labels.

## Implementation Notes

For Next.js and Tailwind:

- Store design tokens in CSS variables.
- Map Tailwind theme colors to semantic variables, not raw blue values.
- Use `lucide-react` icons for reader/admin controls.
- Use route-level layouts for public reading, PDF reader, and admin workspace.
- Keep article rendering separate from admin editing.
- PDF reader should be a specialized route with its own toolbar and side rails.

Suggested component groups:

- `AppShell`
- `PublicNav`
- `ArticleCard`
- `ArticleRow`
- `ArticleReader`
- `BookCard`
- `BookShelf`
- `PdfReaderShell`
- `ReaderToolbar`
- `AdminShell`
- `ContentTable`
- `PublishStatusChip`
- `CommandSearch`

## Quality Checklist

Before shipping any screen in this design language:

- The primary action is visually obvious.
- Long-form reading is 640-760px wide on desktop.
- Body text is readable at mobile and desktop sizes.
- Blue is present as the brand signal but does not dominate the page.
- Cards are not nested inside other cards.
- Book covers and article images are clear and not decorative filler.
- Admin tables/forms are denser than public pages.
- Search, filters, loading, empty, and error states exist.
- Focus states are visible.
- Dark mode and warm reading mode are checked.

## Future Skill Conversion Notes

When converting this file into a skill, the skill should instruct Codex to:

- Reuse this blue editorial token system.
- Build actual reading/product screens first, not landing-page placeholders.
- Prioritize article, book, PDF reader, and admin publishing workflows.
- Use Notion-like structure only where it improves clarity.
- Preserve reading comfort over visual novelty.
- Check current project conventions before applying the system.
- Verify responsive layouts and text fitting before final output.
