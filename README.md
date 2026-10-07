# Withso company website

The Withso company website introduces Mapsmith and JurisField as the core GIS products, NammaTN as a social impact initiative, and Zeros as an AI orchestrator platform.

## Pages

- `/` — company homepage
- `/mapsmith` — geospatial platform
- `/jurisfield` — field operations
- `/about` — company information
- `/privacy` — privacy policy
- `/terms` — terms and conditions
- Legacy policy routes and a custom 404 page

## Requirements

Python 3.10 or later and Node.js. The website has no external package dependencies, database, API keys or runtime secrets.

## Build and validate

From the repository root:

```sh
bash scripts/build.sh
```

The build generates HTML, validates routes, assets, metadata and accessible tab relationships, checks JavaScript syntax, and copies the finished website to `out/` for deployment. The same command is available through the package script:

```sh
npm run build
```

## Preview

```sh
python3 -m http.server 8000 --directory dist --bind 0.0.0.0
```

Open `http://localhost:8000`. Clean page paths such as `/mapsmith` resolve to their directory index.

## Editing

- Page copy, shared header/footer and product illustrations: `scripts/generate_site.py`
- Styles and responsive layouts: `dist/assets/site.css`
- Navigation, reveal effects and use-case tabs: `dist/assets/site.js`
- Product brand marks: `dist/assets/mapsmith.svg` and `dist/assets/jurisfield.svg`
- Route and accessibility checks: `scripts/validate_site.py`

Generated HTML in `dist/` is checked in so the website can be served without a build step. Regenerate it after changing the generator. CSS, JavaScript and product assets are authored directly and preserved during generation.

Illustrative workspaces and sample charts are demonstration content, not live product sessions or measured usage statistics.

## Deployment

Configure a static web host with:

- Build command: `npm run build` or `bash scripts/build.sh`
- Output directory: `out`
- Domain: `withso.com`

The package build script also works with `bun run build`. The generated pages use `https://withso.com` for canonical URLs, social metadata, robots and the sitemap. Domain and DNS settings are managed separately from this repository.

Serve directory index files for the page routes and `404.html` for missing pages. The entire website runs as static HTML, CSS, JavaScript and SVG assets.

## Copyright

© 2026 Withso Technologies (OPC) Private Limited. All rights reserved. No open-source licence is granted by this repository. Third-party names and marks belong to their respective owners.
