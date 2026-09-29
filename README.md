# Wisit Suwannao | Portfolio

A responsive static portfolio focused on applied AI, machine learning, and data science. It is built with <strong>Astro 7.3.5</strong>, <strong>TypeScript 7.0.2</strong>, and native CSS, with almost no client-side JavaScript.

## Run locally

Requirements: Node.js 22.12+ and npm 9.6.5+.

    npm ci
    npm run dev

Build and inspect the static output:

    npm run build
    npm run preview

The generated site is in <code>dist/</code>. The GitHub Pages build uses the project path <code>/Wisit-s-Portfolio/</code>; local development uses <code>/</code>.

## Content structure

- <code>src/pages/index.astro</code> - portfolio content and metadata
- <code>src/styles/global.css</code> - layout, responsive styles, and reduced-motion support
- <code>src/scripts/active-section.ts</code> - progressive enhancement for the active navigation item
- <code>public/images/</code> - portrait, project/event evidence, and decorative texture
- <code>.github/workflows/deploy.yml</code> - build and GitHub Pages deployment workflow

Competition results are separated from employment experience. The selected-project section is limited to Twenty Constitutions Digitalization. Local source PDFs and photos were used for the CRUiT poster, Coffee Chain team photo, GemmaClip slide cover, and CPE presentation cover. The generated abstract texture is decorative only and does not represent project evidence.

The original static portfolio is preserved on the <code>legacy</code> branch. The refreshed Astro source and its required assets are maintained on <code>main</code>; only the generated <code>dist/</code> directory is deployed.

## Hosting

This repository uses <strong>GitHub Pages</strong>. The workflow builds the Astro site and deploys <code>dist/</code> when changes reach <code>main</code>. If a deployment does not start, confirm the repository's Pages publishing source is set to <strong>GitHub Actions</strong>.

Expected project-site URL:

<https://palapluem.github.io/Wisit-s-Portfolio/>

An optional custom domain such as <code>palapluem.me</code> must be registered separately (availability and renewal cost depend on the registrar), then configured in GitHub Pages and at the domain's DNS provider. No domain or external hosting settings have been changed.

## Deployment

GitHub Actions builds and publishes the site to GitHub Pages when changes are pushed to <code>main</code>. The previous portfolio is retained in <code>legacy</code> and can be revisited without replacing its history.
