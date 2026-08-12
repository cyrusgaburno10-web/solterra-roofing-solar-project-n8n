/* ==========================================================================
   SITE CONFIG — edit this file to re-brand this template for a new client.

   This is the ONE file that should need editing for a straightforward
   reskin: new business name, new contact details, new webhook. Everything
   here is read by the hydration script near the bottom of the HTML file,
   which fills in every element tagged data-cfg-text / data-cfg-href.

   The n8n webhook URL below is only the DEFAULT. It can be overridden live,
   without touching any file, via the "Integration settings" panel in the
   site footer — that override is stored in the visitor's... no, the
   OPERATOR's browser (localStorage) and takes priority over this file.
   ========================================================================== */

window.SITE_CONFIG = {

  business: {
    name: "Solterra",
    tagline: "Solar that pays for itself.",
    phoneDisplay: "1300 123 456",
    phoneHref: "tel:+611300123456",
    emailDisplay: "hello@solterra.com.au",
    emailHref: "mailto:hello@solterra.com.au",
    abn: "12 345 678 901",
    builderLicence: "XXXXXX",
    electricalLicence: "XXXXXX",
    googleRating: "4.9",
    // Must match the REAL count on your Google Business Profile - this feeds the
    // aggregateRating in structured data, and Google can penalise structured data
    // whose review numbers don't match what's actually on your listing.
    googleReviewCount: "1",
    yearsInBusiness: "18",
    // Used only in structured data (JSON-LD), not shown prominently on the page.
    // A real address is required for local-business schema to be valid/useful.
    address: {
      streetAddress: "1 Example Street",
      suburb: "Sydney",
      state: "NSW",
      postcode: "2000"
    }
  },

  // Used to hydrate <title>, meta description and og:title on load.
  seo: {
    title: "Solterra Solar & Roofing Australia — Solar that pays for itself, on a roof built to outlast it.",
    description: "CEC-accredited solar, battery & roofing installed by one Australian team. Free roof health check with every solar quote — so you're never told the roof needs work after the panels go up."
  },

  integration: {
    // Default n8n webhook - the "Website Inbound" node's Production URL from
    // Workflows/01-ai-agent-inbound-intake.json.
    // Override this live from admin.html (separate page, password-gated) instead of
    // editing this file, if you'd rather not touch code per client.
    n8nWebhookUrl: "https://YOUR-N8N-HOST/webhook/wf1-website",

    // A public Google Calendar "Appointment schedule" booking link (Google Calendar →
    // Create → Appointment schedule → Share). No API key needed - it's just a link,
    // which is why this is safe to set directly on the website, unlike an AI API key.
    googleCalendarUrl: "https://calendar.google.com/calendar/appointments/schedules/YOUR-SCHEDULE-ID",

    // Which AI model n8n should use for this visitor's conversation: "anthropic" (Claude),
    // "gemini", or "grok". This is only a PREFERENCE sent along with the lead - the actual
    // API key for whichever model runs lives in n8n's environment variables, never here.
    // See admin.html for why this can't safely be a website API-key field.
    aiProvider: "anthropic",

    // Gates admin.html - a completely separate page from the main site, not linked
    // from it anywhere. Go to admin.html directly and enter this password.
    //
    // Honest limits: this is a casual-visitor deterrent, not real security - anyone who
    // deliberately reads this file's contents can see the password in plain text. That's
    // an acceptable trade-off ONLY because nothing more sensitive than a webhook URL and
    // a calendar link sits behind it - the real secrets (API keys) never touch either
    // page at all, gated or not. Never store anything more sensitive behind this.
    settingsPassword: "02102000"
  },

  // Leave IDs as the placeholder values below to keep analytics off entirely -
  // analytics.js checks for exactly these placeholders before loading anything.
  analytics: {
    ga4MeasurementId: "G-XXXXXXXXXX",       // Google Analytics 4 → Admin → Data Streams
    metaPixelId: "000000000000000"          // Meta Events Manager → Data Sources → Pixel
  }

};
