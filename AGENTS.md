# Withso website development

This repository contains a static company website built with Python-generated HTML, plain CSS and vanilla JavaScript. No external package installation, database or application secrets are needed.

## Working files

- Edit page copy and HTML composition in `scripts/generate_site.py`.
- Edit styling in `dist/assets/site.css` and behaviour in `dist/assets/site.js`.
- Preserve the supplied product SVGs.
- Regenerate HTML after generator changes. Direct edits to generated HTML will be overwritten.
- Keep `dist/` in source control. `out/` is the generated deployment copy.

## Commands

Build and check from the repository root:

```sh
bash scripts/build.sh
```

Preview:

```sh
python3 -m http.server 8000 --directory dist --bind 0.0.0.0
```

## Product and design requirements

- Put Mapsmith and JurisField first as the company’s geospatial products.
- Present NammaTN as an independent social impact initiative and Zeros with lower prominence.
- Keep copy short, specific and factual. Do not invent customers, funding, partnerships, product availability or performance metrics.
- Preserve a white background, restrained colours, generous spacing and subtle motion. Pastel gradients belong only in feature-preview panels.
- Label illustrative workspaces and sample data clearly.
- Maintain responsive layouts, keyboard navigation, visible focus, reduced-motion support and usable mobile navigation.
- Preserve About, Privacy, Terms and verified company information.
- Keep public URLs and metadata on `https://withso.com`.
- Keep provider branding, local credentials, environment files, archives and temporary runtime files out of the source and website assets.

## Hosting

Build with `bash scripts/build.sh` and publish `out/` on a static web host. Source commits and successful local builds do not confirm a production deployment. Confirm deployment status separately when publishing is requested.
