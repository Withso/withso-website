# Withso website development

This repository contains the static Withso company website, built with Astro, TypeScript and React islands. It needs Node.js 22.12 or later and npm. No database, API keys or application secrets are needed.

## Working files

- Pages and copy live in `src/pages/`. Shared facts (company details, links, navigation, sitemap routes) live in `src/data/site.ts`, and policy text in `src/data/legal.ts`. Change a fact there instead of repeating it in a page.
- Layouts are in `src/layouts/`: `CompanyLayout` for the homepage, About, policies and 404, and `ProductLayout` for Mapsmith and JurisField.
- Styles are in `src/styles/` (`global.css`, `company.css`, `product.css`). Site-wide behaviour is in `src/scripts/site.ts`.
- Interactive product samples are React islands in `src/components/islands/`. Keep them self-contained: no network requests, geolocation or stored data.
- Files in `public/` are published unchanged. Preserve the supplied product SVGs, wordmark and icons.
- `out/` is the generated deployment folder and is not committed.

## Commands

Build and check from the repository root:

```sh
npm run build
```

This runs `astro check`, `astro build` and `scripts/validate-site.mjs`. `bash scripts/build.sh` does the same and installs dependencies first if needed. Fix every validation failure rather than loosening the validator.

Preview with live reload:

```sh
npm run dev -- --host 127.0.0.1 --port 4321
```

Serve the built output with `npm run preview`.

## Product and design requirements

- Put Mapsmith and JurisField first as the company’s geospatial products.
- Present NammaTN as an independent social impact initiative and Zeros with lower prominence.
- Keep copy short, specific and factual. Do not invent customers, funding, partnerships, product availability, prices or performance metrics.
- The homepage, About, policy and 404 pages use the editorial company layout: warm paper background, left navigation rail, numbered sections, serif body text and hairline grid. The product pages use the product layout: top bar, large headings, brand-coloured interactive stages and FAQ.
- Keep colours restrained, spacing generous and motion subtle.
- Label illustrative workspaces and sample data clearly.
- Maintain responsive layouts, keyboard navigation, visible focus, reduced-motion support and usable mobile navigation.
- Load every script, style, font and image from this site. The privacy policy states that the website has no tracking or third-party scripts.
- Preserve About, Privacy, Terms, the legacy `/legal/` routes and verified company information.
- Keep public URLs and metadata on `https://withso.com`, and keep `public/llms.txt` accurate when products or initiatives change.
- Keep provider branding, local credentials, environment files, archives and temporary runtime files out of the source and website assets.

## Hosting

Build with `npm run build` and publish `out/` on a static web host. Source commits and successful local builds do not confirm a production deployment. Confirm deployment status separately when publishing is requested.
