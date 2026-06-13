# withso.com

Marketing site for withso. Built with **Next.js 16 (App Router) + TypeScript + Tailwind CSS v4**.

## Routes

| Path | Page |
| --- | --- |
| `/` | Home (hero + ecosystem) |
| `/legal/privacy-policy` | Privacy Policy |
| `/legal/terms` | Terms of Service |

## Run

```bash
bun run dev      # http://localhost:3000
bun run build    # production build
```

## Where things live

| What | File |
| --- | --- |
| **Home copy + footer (mock data)** | [`lib/site-data.ts`](lib/site-data.ts) |
| **Legal copy + company info** | [`lib/legal-content.ts`](lib/legal-content.ts) |
| Brand tokens (colors, fonts, motion) | [`app/globals.css`](app/globals.css) |
| Root layout (header + footer wrap all pages) | [`app/layout.tsx`](app/layout.tsx) |
| Home composition | [`app/page.tsx`](app/page.tsx) |
| Top navigation | [`components/site-header.tsx`](components/site-header.tsx) |
| Minimal footer | [`components/site-footer.tsx`](components/site-footer.tsx) |
| Hero headline | [`components/hero.tsx`](components/hero.tsx) |
| "Three groups" org diagram | [`components/ecosystem.tsx`](components/ecosystem.tsx) |
| Legal page renderer | [`components/legal-page.tsx`](components/legal-page.tsx) |
| Logo (withso wordmark) | [`components/logo.tsx`](components/logo.tsx) |
| Product / social icons / arrows | [`components/icons.tsx`](components/icons.tsx) |
| Status badges (Live/Preview) | [`components/status-badge.tsx`](components/status-badge.tsx) |
| Item rows + buttons | [`components/item-row.tsx`](components/item-row.tsx), [`components/button.tsx`](components/button.tsx) |

> Content is intentionally separated into data files so copy can be iterated
> without touching components. Company specifics for the legal pages (entity,
> email, address, jurisdiction, effective date) live in one `legalMeta` block.

## Brand

- Background `#f7f6f2` (withso cream) · Ink `#221e1c` (withso wordmark) · Muted `#6f6a64`
- Red `#ed1c24` retained as the "Live" badge accent
- Type: **Hanken Grotesk** (geometric grotesque, heavy display weights)

## Note on legal pages

The Privacy Policy and Terms are an original, professionally-structured
**starting template** — not copied from any source and **not legal advice**.
Review with counsel and fill the `[Add your registered business address]`
placeholder (and confirm the legal entity name) in `lib/legal-content.ts`
before publishing.
