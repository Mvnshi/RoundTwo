# RoundTwo — validation site

Marketing and lead-capture site for **RoundTwo**, an AI revenue recovery service for
contractors. Its only job is to answer one question: *will contractors raise their hand
and ask for this?*

It is built to take paid traffic: fast, mobile-first, accessible, with real server-side
lead capture and a single analytics abstraction wired to a defined event taxonomy.

There is no product behind it yet — and the copy says so. Nothing on the page claims
customers, revenue or integrations that do not exist.

---

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack, React 19) |
| Language | TypeScript, strict |
| Styling | Tailwind CSS v4, CSS-variable design tokens |
| Components | shadcn/ui on Base UI (`base-nova` preset) + a small set from Magic UI |
| Icons | Lucide |
| Motion | `motion` via `MotionConfig reducedMotion="user"`, plus `tw-animate-css` |
| Forms | react-hook-form + Zod (one schema shared by client and server) |
| Fonts | Instrument Sans + Geist Mono via `next/font` |

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in at least one lead destination
npm run dev                  # http://localhost:3000
```

```bash
npm run lint                 # ESLint (React Compiler rules included)
npx tsc --noEmit             # type check
npm run build && npm start   # production build
```

## Environment variables

Everything is optional for the site to *render*. Lead delivery is not — see below.
Full annotated list in [`.env.example`](./.env.example).

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Before launch | Canonical origin for metadata, Open Graph, sitemap, robots |
| `LEAD_WEBHOOK_URL` | One of these two | Server-side POST target for each lead (n8n, Zapier, Make, CRM, Sheets bridge) |
| `LEAD_WEBHOOK_SECRET` | Optional | Sent as `x-roundtwo-secret` so your automation can verify the caller |
| `RESEND_API_KEY` + `CONTACT_NOTIFICATION_EMAIL` | One of these two | Email notification per lead |
| `RESEND_FROM_EMAIL` | Optional | Verified Resend sender; defaults to Resend's test sender |
| `NEXT_PUBLIC_BOOKING_URL` | Optional | Shows "Book a 15-minute call" after a lead is stored |
| `NEXT_PUBLIC_GA_ID` | Optional | Google Analytics 4 |
| `NEXT_PUBLIC_META_PIXEL_ID` | Optional | Meta pixel |
| `NEXT_PUBLIC_POSTHOG_KEY` / `_HOST` | Optional | PostHog |

With no analytics IDs set, **no analytics script loads at all** — no vendor JS, no cookies.

> **`NEXT_PUBLIC_*` variables are read at build time.** The home page is statically
> prerendered, which is what keeps it fast under paid traffic, so those values are baked in
> when `next build` runs. Set them in your host's environment *before* building (Vercel,
> Netlify and Cloudflare all do this automatically) and rebuild after changing one. The
> server-only variables — `LEAD_WEBHOOK_URL`, `LEAD_WEBHOOK_SECRET`, `RESEND_API_KEY`,
> `CONTACT_NOTIFICATION_EMAIL`, `RESEND_FROM_EMAIL` — are read per request and can change
> without a rebuild.

## Lead capture

`POST /api/lead` → [`src/app/api/lead/route.ts`](./src/app/api/lead/route.ts)

1. Rate limit — 20 requests / 10 min per IP (burst) and 5 accepted leads / hour per IP.
   Failed validation does **not** count against the accepted limit, so a real person who
   mistypes their email is never locked out.
2. Zod validation against the same schema the browser used.
3. Spam checks — hidden honeypot field, plus a submit-time check (rejects anything faster
   than 2.5s or older than 6h). Both fail with a single generic message so the traps stay
   invisible.
4. Delivery — POSTs the webhook (one retry on failure), and/or sends the Resend email.
   The lead counts as stored if **at least one** destination accepts it.
5. Response — success only if the lead was actually stored.

**The form never fakes success.** If every destination fails, the API returns 502 and the
form shows the error plus a `mailto:` fallback, so the lead still reaches you. In
development with nothing configured, leads are logged to the server console instead.

Each lead is delivered as:

```jsonc
{
  "type": "lead.created",
  "lead": {
    "submittedAt": "2026-01-01T00:00:00.000Z",
    "firstName": "Dave",
    "email": "dave@acmeroofing.com",
    "companyName": "Acme Roofing",
    "companyWebsite": "https://acmeroofing.com",  // scheme added server-side
    "businessType": "Roofing",
    "leadVolume": "51-100",
    "crm": "JobNimbus",
    "attribution": {
      "utm_source": "google", "utm_medium": "cpc", "utm_campaign": "...",
      "utm_content": "...", "utm_term": "...", "gclid": "...", "fbclid": "...",
      "landingUrl": "...", "landingPath": "...", "referrer": "...", "firstSeenAt": "..."
    },
    "source": { "ip": "…", "userAgent": "…", "pagePath": "…" }
  }
}
```

## Analytics

One entry point: [`src/lib/analytics.ts`](./src/lib/analytics.ts). Components call
`track(event, props)` and never touch `gtag` / `fbq` / `posthog` directly. Every
destination is optional and every call is wrapped so a broken tag can't break the page.

Events: `hero_cta_clicked`, `secondary_cta_clicked`, `recovery_calculator_started`,
`recovery_calculator_completed`, `audit_form_opened`, `audit_form_started`,
`audit_form_submitted`, `booking_clicked`, `faq_opened`.

Meta's standard events are mapped where they exist (`audit_form_submitted` → `Lead`,
`audit_form_opened` → `InitiateCheckout`, `booking_clicked` → `Schedule`); everything else
is sent as a custom event.

Attribution ([`src/lib/attribution.ts`](./src/lib/attribution.ts)) is captured once per
session into `sessionStorage`, keeps the first touch, and is replaced only when a newer
visit carries campaign parameters. It rides along with every lead.

## Project layout

```
src/
  app/
    api/lead/route.ts        lead endpoint
    layout.tsx page.tsx      root layout + home page
    privacy/ terms/          legal placeholders (need legal review)
    opengraph-image.tsx      generated OG card
    sitemap.ts robots.ts icon.svg
    globals.css              design tokens + type scale
  components/
    analytics/               script loader + attribution boot
    layout/                  header, footer, container, section, wordmark
    lead/                    audit dialog, form, CTA button
    recovery/                the hero recovery timeline
    sections/                one file per page section
    ui/                      shadcn + Magic UI components
  lib/
    site.ts                  brand name, nav, CTA labels  ← rename the company here
    content.ts               all page copy as typed data
    analytics.ts attribution.ts
    lead-schema.ts lead-delivery.ts rate-limit.ts utils.ts
```

**Renaming the brand** is a one-line change in `src/lib/site.ts`. Page copy lives in
`src/lib/content.ts`, not scattered through JSX.

## Design system

Adapted from the **MindMarket** style on refero.design: warm cream paper, a single
structural accent, generous "sticker-soft" rounding, and elevation by surface stack
rather than shadows. Tokens live in `globals.css`:

| Token | Value | Use |
|---|---|---|
| `--background` | `#F5F1E4` | Cream paper — the dominant canvas |
| `--card` | `#FFFFFF` | Elevated surfaces. There are no shadows anywhere |
| `--secondary` | `#E0DBCE` | Sandstone — recessed surfaces, footer, icon wells |
| `--hairline` | `#D5D5D4` | The only divider |
| `--foreground` | `#2C2E2A` | Ink |
| `--muted-foreground` | `#63655F` | Stone, for secondary text |
| `--brand-field` | `#C9EE6B` | Large colour fields (the hero). Same hue family, reference chroma |
| `--brand` | `#D9FF43` | The electric accent, used **only** on small elements: CTA badges, status chips, revenue figures |
| `--lost` / `--lost-soft` | `#C4402C` / `#FF705D` | Leak and lost states |

Two greens is deliberate. At full bleed the electric chartreuse reads as highlighter,
so large fields use the calmer sibling and the bright accent stays sparing — which is
also how the reference system separates its structural green from its colour pops.

**Geometry.** `--radius` is `1.75rem`, so the derived scale lands on the reference's
proportions: 28px on inputs and small cards, ~39px on dialogs, 40–50px on content
cards. Buttons, chips and the navigation are full pills. Nothing is square.

**Type.** One family, Instrument Sans, at weights 400/500 — authority comes from
scale and tight tracking, not from bolder weights. Display runs to 92px with
`-0.055em` tracking and `0.95` line-height. Geist Mono is reserved for data: step
numbers, status codes, section labels and money.

**Layout.** 1200px measure, 48–72px section padding (so the visual gap between
sections lands in the reference's 80–120px band), centred headings, left-aligned
card content.

`text-display` / `text-h2` / `text-h3` / `text-lead` are registered with `tailwind-merge`
in `src/lib/utils.ts`, so they correctly override component defaults like `text-sm`.

Every rendered text node is verified against WCAG AA by walking computed styles on the
live page, not by eyeballing the palette.

## Accessibility

- Semantic landmarks, skip link, one `h1`, ordered heading levels.
- Every control labelled; sliders expose `aria-label` and `aria-valuetext`.
- Visible focus rings; dialog and sheet trap focus, close on Escape and restore focus.
- Anchors that navigate are real links — never `role="button"`.
- Touch targets meet the 44px guidance on primary actions.
- `prefers-reduced-motion` is honoured in CSS and by `MotionConfig reducedMotion="user"`.
- The live ROI figure is `aria-hidden` with an `sr-only` formatted value beside it.

## Deploying

Any Node host works. Vercel is the shortest path:

1. Push the branch and import the repo.
2. Add the environment variables above (at minimum `NEXT_PUBLIC_SITE_URL` and one lead
   destination).
3. Deploy, then point your domain at it, update `NEXT_PUBLIC_SITE_URL` to match and
   **redeploy** so the new value is baked into the static pages.

Self-hosting: `npm run build && npm start` behind your process manager of choice. The
lead route runs on the Node runtime and is dynamic; everything else is static.

## Before you send paid traffic

- [ ] Set `NEXT_PUBLIC_SITE_URL` to the real domain.
- [ ] Connect `LEAD_WEBHOOK_URL` (and/or Resend) and submit one real test lead end to end.
- [ ] Add the analytics IDs you plan to optimise against.
- [ ] Have `/privacy` and `/terms` reviewed by a lawyer — they are honest drafts, not advice.
- [ ] Replace `hello@roundtwo.com` in `src/lib/site.ts` with a monitored inbox.
