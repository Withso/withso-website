# Withso company website

The Withso company website presents Mapsmith and JurisField as the company’s geospatial products, custom GIS development as its services work, NammaTN as an independent social impact initiative and Zeros as an open-source developer productivity initiative.

The site is built with [Astro](https://astro.build), TypeScript and two React islands, and is published as static files.

## Pages

- `/` — company homepage
- `/mapsmith` — Mapsmith web GIS, with an interactive sample workspace
- `/jurisfield` — JurisField field operations, with an interactive capture, sync and review sample
- `/about` — company, approach to GIS development and verified company information
- `/privacy` and `/terms` — website policies
- `/legal/privacy-policy` and `/legal/terms` — legacy policy routes, with canonical links to the current paths
- `404.html` — page-not-found
- `/sitemap.xml`, `/robots.txt` and `/llms.txt`

## Requirements

Node.js 22.12 or later (see `.node-version`) and npm. The website has no database, API keys or runtime secrets.

## Commands

From the repository root:

```sh
npm install        # install dependencies once
npm run dev        # development server with live reload at http://localhost:4321
npm run build      # type check, build into out/ and validate the output
npm run preview    # serve the built out/ folder
```

`bash scripts/build.sh` installs dependencies from the lockfile when `node_modules/` is missing, then runs `npm run build`.

## Validation

`npm run build` runs `astro check`, `astro build` and `scripts/validate-site.mjs`. The validator reads every page in `out/` and fails the build when it finds:

- broken internal links, missing anchors or missing assets
- scripts, styles, fonts or images loaded from another host
- missing titles, descriptions, canonical URLs or `lang`, or descriptions longer than 165 characters
- more or fewer than one `h1`, skipped heading levels, duplicate IDs or a missing `<main id="main">`
- ARIA references without a matching ID, tabs without panels, and unlabelled links, buttons and form fields
- malformed SVG or sitemap XML, a sitemap that does not match the indexable pages, or a missing `llms.txt`
- hidden files, source maps or archives in the output

Run it on its own with `npm run validate`.

## Editing

- Routes and page copy: `src/pages/`
- Company details, links, navigation and sitemap routes: `src/data/site.ts`
- Privacy policy and terms text: `src/data/legal.ts`
- Layouts: `src/layouts/BaseLayout.astro` (document head and metadata), `CompanyLayout.astro` (homepage, About, policies and 404), `ProductLayout.astro` (Mapsmith and JurisField) and `LegalLayout.astro`
- Shared footer, social links, icons and wordmark: `src/components/`
- Interactive product samples: `src/components/islands/MapsmithWorkspace.tsx` and `JurisFieldFlow.tsx`
- Styles: `src/styles/global.css` (tokens, buttons and footer), `company.css` and `product.css`
- Menus, scroll reveal, carousel, tabs, map crosshair and policy table of contents: `src/scripts/site.ts`
- Generated contour artwork: `src/lib/terrain.ts`, served from `src/pages/assets/terrain-[variant].svg.ts`
- Company wordmark: `src/assets/withso-logo.svg`, inlined so it follows the text colour. `public/assets/withso-logo.svg` keeps the same file at its public URL.
- Product marks, the original W mark, favicons and `llms.txt`: `public/`, copied to the output unchanged

Illustrative workspaces and sample records are demonstration content, not live product sessions or measured usage.

## Deployment

Configure a static web host with:

- Build command: `npm run build` or `bash scripts/build.sh`
- Output directory: `out`
- Domain: `withso.com`

Serve directory index files for page routes and `404.html` for missing pages. Canonical URLs, social metadata, robots and the sitemap use `https://withso.com`. Domain and DNS settings are managed separately from this repository.

## Copyright

© 2026 Withso Technologies (OPC) Private Limited. All rights reserved. No open-source licence is granted by this repository. Third-party names and marks belong to their respective owners.
