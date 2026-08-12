# Roofing Solar Company — project index

Everything built for the AU roofing/solar lead-automation project, organized by category.
Each folder below is self-contained for its purpose — see its own files for detail.

## Website/
The live marketing site + lead-capture funnel. Open `solterra-landing-au-solarfirst.html`
directly, or serve the folder locally (`python3 -m http.server 8080` from inside `Website/`)
so `config.js`/`images/` resolve correctly.

- `solterra-landing-au-solarfirst.html` — the site itself. Carries zero settings/admin code — see `admin.html` below.
- `admin.html` — the settings page, separate from the site and not linked from it anywhere. Password-gated; see `Documentation/settings-access-guide.md`.
- `config.js` — the one file to edit to rebrand for a new client. **Change `settingsPassword` from the "changeme" default before launch.**
- `config-helpers.js` — shared logic the main site and `admin.html` both load, so they can never read settings differently from each other.
- `analytics.js` — GA4 + Meta Pixel loader, off by default until real IDs are set
- `privacy-policy.html` / `terms-of-service.html` — linked from the site footer
- `robots.txt` / `sitemap.xml` — replace `YOUR-DOMAIN` in both before launch
- `REBRAND-GUIDE.md` — how to reskin this for a different client, ~15 minutes
- `images/` — the three photos used across hero, materials, and financing sections
- `middleware.js` — Vercel Edge Middleware that locks `admin.html` behind a
  real, host-enforced login (not just the page's own password prompt). See
  `Documentation/deploy-lockdown-guide.md`.
- `netlify.toml` / `netlify/edge-functions/admin-auth.js` — the Netlify
  equivalent of `middleware.js`, same purpose.

**Launch readiness:** open `admin.html` directly (its own page, not linked from the
site — see `Documentation/settings-access-guide.md`), unlock with your settings
password, and it shows a live checklist of every placeholder value still left to
replace — webhook, calendar,
ABN, licences, address, analytics — before this is safe to show a real customer. The
"Sample marketing site" footer disclaimer disappears on its own once the essentials
(ABN, licences, address) are filled in.

## Workflows/
The four importable n8n workflow files. Import each one individually via n8n →
Workflows → Import from File. See `Documentation/build-guide.html` for the full setup
order and `Documentation/SOP.html` §2 for what each node's config controls.

- `01-ai-agent-inbound-intake.json` — Telegram/FB/IG/WhatsApp/website → AI qualify → HubSpot
- `02-booking-confirmation-reminders.json` — meeting booked → confirm → 24h/1h reminders
- `03-followup-nurture-drip.json` — cold leads → Day 1/3/7/14/monthly drip
- `04-completion-review-recovery.json` — Won → review+referral · Lost → recovery → nurture

## Configuration/
Templates and standalone snippets, not the live site's own runtime config (that's in
`Website/config.js`).

- `.env.example` — every credential the n8n workflows read; copy to `.env` and fill in
- `website-chat-widget.html` — standalone chat widget snippet, for embedding into a
  *different*, already-existing website (the main `Website/` folder already has its own
  built-in version of this — use that one unless you're deploying somewhere else)

## Documentation/
Reference and how-to material — read before building or when you need to look something up.

- `build-guide.html` — one-time setup, in order, every account and field
- `workflow-diagram.html` — the funnel diagram, tool choices, sourced AU pricing/economics
- `hubspot-setup.md` — exact HubSpot properties and pipeline stages to create
- `claude-system-prompt.md` — the AI agent's actual instructions, explained
- `settings-access-guide.md` — non-coder walkthrough for `admin.html`, the separate password-gated settings page
- `deploy-lockdown-guide.md` — how to lock `admin.html` behind a real,
  host-enforced login on Vercel or Netlify once you go live

## SOPs/
Ongoing operations, not one-time setup.

- `SOP.html` — daily/weekly checklists, troubleshooting, change procedures, incident
  response, and an honest known-limitations section (no live end-to-end test yet, no
  automatic retry on API failures — read this before treating the system as production-hardened)

## Assets/
Original source photos as provided, before any cropping/renaming for the site.

---

## Live published copies

These three documents are also published as Claude Artifacts (hosted independently of
this folder — updating the local file and re-publishing keeps the same URL):

| Document | Live link |
|---|---|
| Workflow diagram + pricing/economics | https://claude.ai/code/artifact/2f7d161c-8b05-46de-b233-e02bf7497327 |
| Build & Deploy Guide | https://claude.ai/code/artifact/d19c2dd6-819a-4226-bfe9-02de339d35e7 |
| SOP — Operations Manual | https://claude.ai/code/artifact/d9024bf4-d498-44df-9d7e-62818ec36027 |

If any of these are edited locally, ask for them to be republished to push the update live.
