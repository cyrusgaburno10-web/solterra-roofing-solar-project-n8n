# Rebranding this template for a new client

This page was built so a new roofing/solar business can be reskinned onto it without
touching the 900+ lines of HTML/CSS. Five steps, roughly 10–15 minutes:

## 1. Edit `config.js`
Business name, phone, email, ABN, licence numbers, Google rating, years in business, page
title/description, and the default n8n webhook URL all live in one file:
`website/config.js`. Every one of those values is pulled from there automatically on page
load — there's nothing else to find-and-replace in the HTML for these fields.

## 2. Swap the three photos
Drop new files into `website/images/` using the same three names, or update the three
`<img>`/`background-image` references if the new filenames differ:
- `hero-solar-install.jpeg` — the hero background
- `roofing-materials.jpeg` — the materials showcase section
- `battery-storage-home.jpeg` — the financing banner background

## 3. Hand-edit the marketing copy
Deliberately **not** templated, because it should be written fresh per client, not
mechanically swapped:
- Hero headline and lead paragraph
- The testimonial in the "Reviews" section
- Pricing figures in the Pricing section, if the new business's market/pricing differs
  from the sourced AU 2026 ranges currently shown
- Service descriptions, if the new business doesn't offer all three services

## 4. Point it at the client's n8n instance, calendar, and AI model
`admin.html` — a separate page, not linked from the site itself, password-gated (see
`Documentation/settings-access-guide.md`) — covers all three, no code editing required.
Once this goes live for a real client, also lock `admin.html` down at the hosting
level (Vercel or Netlify) rather than relying on the page's own password prompt alone
— see `Documentation/deploy-lockdown-guide.md`.
Or set the matching field in `config.js` before publishing so it's correct by default:
- **n8n webhook URL** — paste it, click Test connection, then Save.
- **Google Calendar booking link** — a public "Appointment schedule" link from the
  client's own Google Calendar (Create → Appointment schedule → Share). No API key or
  OAuth, so it's safe to store directly in the browser or `config.js`.
- **AI model** — Claude, Gemini, or Grok. This only sends a *preference* along with each
  lead; the actual API key for whichever model is chosen lives in n8n's `.env`, never in
  the website. See the panel's own note for why an API-key field doesn't belong here.

## 5. Legal review
The footer disclaimer already flags this, but worth repeating: ABN, licence numbers, and
rebate-scheme claims (SRES, Cheaper Home Batteries) need to be the client's real,
current details before this goes live — none of the placeholder values are safe to
publish as-is.

---

That's the whole reskin. Everything structural — layout, the AI chat widget, the quote
form's connection to the n8n intake workflow, the pricing section, the solar-panel
background texture — carries over unchanged.
