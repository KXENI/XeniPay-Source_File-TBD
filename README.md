# XeniPay website

A responsive Next.js App Router redesign of the supplied XeniPay Figma landing page. Built with TypeScript, Tailwind CSS v4, locally hosted Geist fonts, and small React client components for interaction. No animation library or third-party tracking is loaded.

The visual system uses the checked-in [Pastel Rail palette](./COLORS.md): deep violet night surfaces, paper editorial sections, `#5B478A` primary actions, violet depth, forest transaction details, and pastel illustration tones. The active interface avoids blue. Canonical CSS custom properties live at the top of `src/app/globals.css`.

## Development

Use Node.js 22.23.3 (`nvm use` reads `.nvmrc`). The DOM test tools require Node.js 22.22.2+, 24.15.0+, or 26+ within the supported engine ranges.

```sh
npm install
npm run dev
```

Open http://localhost:3000. Production: `npm run build` then `npm start`.

## Quality checks

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

## Project structure

- `src/app`: server-rendered pages, metadata, sitemap, robots, social previews, contact endpoint.
- `src/components`: focused layout and interactive components. The page shell and static marketing content remain server components.
- `src/lib/site.ts`: navigation, site configuration, and FAQ content.
- `src/lib/contact.ts`: shared validation and safe email draft construction.
- `src/app/globals.css`: design tokens, layout, bespoke illustrations, responsive styles, and motion preferences; Tailwind utilities are available throughout.
- `public/brand`: original white XeniPay logo exported from the supplied Figma file.
- `tests`: contact validation and email encoding tests.

## Design and content

The [Figma source](https://www.figma.com/design/ZbOF2O5sfJnpfpNroJaFjh/XeniPay---Source-Files?node-id=1-19797) supplied the travel-specific product story, original logo, four-step journey, target industries, and contact address. The redesign changes its light layout to a dark navy and pale mint system with original CSS/SVG product illustrations. [Railway](https://railway.com/) informed the dark visual direction; the product and feature storytelling draws from [AiPrise](https://www.aiprise.com/), [Dodo Payments](https://dodopayments.com/), and [Payhawk](https://payhawk.com/).

All transaction amounts and product UI shown are clearly marked illustrative. They are not connected to real payment infrastructure. No unverified partner logos, performance statistics, testimonials, certifications, or fees have been added.

## Demo requests

Without `CONTACT_WEBHOOK_URL`, the form prepares an email draft to the existing Figma contact address, `info@xeni.com`. The user reviews and sends it from their email app. It never claims a lead was submitted when it was not.

For online delivery, copy `.env.example` to `.env.local` and configure a trusted HTTPS webhook plus an optional bearer token. The endpoint receives `{ name, email, company, industry, message, source, submittedAt }`. A successful HTTP response from that service is treated as accepted delivery. Keep secrets server-side.

The route checks origin, content type, streamed body size, field values, and a honeypot; it has a delivery timeout and rejects redirects. Configure rate limiting at the hosting edge or ingestion service before enabling public online collection. No personal data is persisted or logged in this app. Review the recipient service's retention and the final privacy notice with your team before launch.

## Deployment

Deploy to a Node-compatible Next.js host. Set `NEXT_PUBLIC_SITE_URL` to the confirmed production origin for canonical URLs, sitemap, and social previews. The default `https://xenipay.com` is a configurable assumption, not a verified deployment domain. Deployments require no font CDN access.

### GitHub Pages

The checked-in GitHub Actions workflow publishes the static site whenever a commit reaches `main`. GitHub Pages cannot run the server-only contact webhook endpoint, so the Pages build deliberately omits it; demo requests use the existing email-draft fallback instead. `sandbox` is intended for work-in-progress changes and does not deploy publicly.

After the repository is created, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**. The first successful `Deploy GitHub Pages` workflow will show the public URL, normally `https://<owner>.github.io/<repository>/`.

Before launch, confirm the domain, recipient, product copy, and current partner availability with the XeniPay team. Connect the CRM/webhook if desired. Preview deployments should be protected or configured as noindex by the hosting platform. This project does not execute payments or include a merchant dashboard.

## Accessibility and performance

Semantic landmarks, a skip link, visible focus states, keyboard-operated industry tabs, native FAQ disclosures, labelled forms, status announcements, reduced-motion support, and a global ambient-motion pause control are included. Motion uses CSS transforms and SVG stroke animation. Marketing content is server-rendered, and assets and fonts are local.

Visual browser verification and a screen-reader audit should be run in the target browsers before public launch; automated compilation does not establish full WCAG compliance.
