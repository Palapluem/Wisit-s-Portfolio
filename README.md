# Wisit Suwannao | Portfolio

A responsive static portfolio focused on applied AI, machine learning, and data science. It is built with <strong>Astro 7.3.5</strong>, <strong>TypeScript 7.0.2</strong>, and native CSS. Client-side JavaScript is one small progressive-enhancement module; the site works without it.

## Run locally

Requirements: Node.js 22.12+ and npm 9.6.5+.

    npm ci
    npm run dev

Build and inspect the static output:

    npm run build
    npm run preview

The generated site is in <code>dist/</code>. The site is served from the root of its custom domain, so every build uses the base path <code>/</code>.

## Content structure

- <code>src/data/portfolio.ts</code> - single source for all content: profile, navigation, case studies (projects and competitions), numbers, capabilities, credentials, and organisation marks
- <code>src/layouts/Base.astro</code> - shared page shell: metadata, theme bootstrap, skip link, pointer glow, navigation, and footer
- <code>src/pages/index.astro</code> - home page sections and their order
- <code>src/pages/work/[slug].astro</code> - one case-study page per project or competition, with previous and next links
- <code>src/components/Nav.astro</code> - floating pill navigation with a mobile sheet and scroll-spy
- <code>src/components/WorkCard.astro</code> - Selected work cards that open case pages
- <code>src/components/StoryMosaic.astro</code> - filterable competition gallery with result badges
- <code>src/components/TechChip.astro</code>, <code>src/components/OrgMark.astro</code> - technology chips and organisation logos
- <code>src/components/Marquee.astro</code> - endless, draggable row used for the organisation logos and the language and tool chips
- <code>src/components/Icon.astro</code> - inlines Phosphor icons (MIT) from <code>src/assets/icons/</code>
- <code>src/styles/tokens.css</code> - design tokens: OKLCH colours for dark and light themes, type scale, spacing, radii, easing
- <code>src/styles/global.css</code> - layout, components, motion, and reduced-motion support; every colour and font comes from the tokens
- <code>src/scripts/active-section.ts</code> - progressive enhancement: theme switch, mobile menu, scroll-spy, reveals, number count-up, competition filter, capability tabs, pointer effects, marquee rows, floating contact pill, toast, email copy, and the contact form draft
- <code>src/assets/fonts/</code> - Geist and Geist Mono (OFL, self-hosted); Sarabun is kept as the Thai-glyph fallback
- <code>src/assets/tech/</code> - technology marks for the stack chips, from Simple Icons (CC0, see the licence file in that folder)
- <code>public/logos/</code> - organisation logos from each organisation's official website, app, or brand kit; the CAI Camp logo comes from an archived copy of its retired official site
- <code>public/images/</code> - portrait, project and event evidence; <code>public/images/r/</code> holds right-sized WebP copies listed in <code>src/data/image-variants.ts</code> and served through <code>srcset</code>
- <code>.github/workflows/deploy.yml</code> - build and GitHub Pages deployment workflow

## Design notes

- The page follows the system colour scheme; the sun and moon toggle in the navigation stores an explicit choice in <code>localStorage</code>, and the new theme opens as a circle from the toggle where View Transitions are supported.
- The amber accent is reserved for results, the active section, and focus rings; green marks live or in-progress status only.
- Each project and competition opens as its own page. Where the browser supports cross-document View Transitions, the card image and title morph into the case page header.
- On devices with a fine pointer, a soft spotlight follows the cursor; every card lights its border and fills with light under the pointer, larger cards tilt with a glare, buttons lean toward the cursor, and a highlight slides between navigation links, capability tabs, and competition filters. A thin bar along the top shows scroll progress.
- The hero draws dashed construction lines and reveals the name word by word; section titles unmask as they enter, and the numbers count up once to their exact source values.
- The organisation logos and the language and tool chips run in endless rows (<code>src/components/Marquee.astro</code>) that slow on hover, can be dragged, and have a pause button.
- A light runs around the border of the "Now building" and "Languages and tools" cards, a floating contact pill appears between the hero and the contact section, and copying the email address shows a toast.
- Motion has two tiers. Fades, light, colour, and the count-up run for everyone. Travel, tilt, drift, pulses, and the moving rows only run when the visitor has not asked for reduced motion; with <code>prefers-reduced-motion</code>, the logo and tool rows still play at half speed with their pause button, and pages cross-fade instead of morphing. The glass panels become solid under <code>prefers-reduced-transparency</code>.
- Without JavaScript, the navigation renders as plain links, every competition and capability panel is visible, and all case pages remain reachable.

Competition results are separated from employment experience. Selected work includes Thai Public Data Platform and Twenty Constitutions Digitalization. Local source PDFs, project outputs, and event photos provide visual evidence for the projects and competitions.

The original static portfolio is preserved on the <code>legacy</code> branch. The refreshed Astro source and its required assets are maintained on <code>main</code>; only the generated <code>dist/</code> directory is deployed.

## Hosting

This repository uses <strong>GitHub Pages</strong>. The workflow builds the Astro site and deploys <code>dist/</code> when changes reach <code>main</code>. If a deployment does not start, confirm the repository's Pages publishing source is set to <strong>GitHub Actions</strong>.

Live site:

<https://palapluem.dev/>

The custom domain <code>palapluem.dev</code> is registered at name.com and verified for the Palapluem GitHub account. Its DNS points the apex at GitHub Pages (four A and four AAAA records) and <code>www</code> at <code>palapluem.github.io</code> with a CNAME record. The custom domain is set in the repository's Pages settings, with HTTPS enforced; the old <code>palapluem.github.io/Wisit-s-Portfolio/</code> address redirects to it.

## Deployment

GitHub Actions builds and publishes the site to GitHub Pages when changes are pushed to <code>main</code>. Earlier versions are kept on the <code>legacy</code> (original static site) and <code>legacy-v2</code> (first Astro version) branches.
