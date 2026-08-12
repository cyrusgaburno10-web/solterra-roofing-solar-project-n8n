/* ==========================================================================
   CONFIG-HELPERS.JS — shared by the main funnel page AND admin.html.

   Reading these values is identical on both pages (same localStorage keys,
   same config.js defaults), so this lives in one place instead of being
   copied twice and risking the two pages drifting out of sync.

   Load order matters: config.js first, then this file, then whatever page
   script uses these functions.
   ========================================================================== */

// ---- Webhook URL: config.js sets the default; admin.html can override it
// per-browser via localStorage - no code edit or redeploy needed to reconnect. ----
var WEBHOOK_STORAGE_KEY = 'site_webhook_url_override';
function getWebhookUrl(){
  return localStorage.getItem(WEBHOOK_STORAGE_KEY) ||
    (window.SITE_CONFIG && window.SITE_CONFIG.integration && window.SITE_CONFIG.integration.n8nWebhookUrl) ||
    '';
}

// ---- Same override pattern for the Google Calendar link - just a public URL, no key. ----
var CALENDAR_STORAGE_KEY = 'site_calendar_url_override';
function getCalendarUrl(){
  return localStorage.getItem(CALENDAR_STORAGE_KEY) ||
    (window.SITE_CONFIG && window.SITE_CONFIG.integration && window.SITE_CONFIG.integration.googleCalendarUrl) ||
    '';
}

// ---- And for the AI provider preference. This is sent WITH each lead so n8n knows which
// model to call - the API key for that model lives only in n8n's own environment. ----
var AI_PROVIDER_STORAGE_KEY = 'site_ai_provider_override';
function getAiProvider(){
  return localStorage.getItem(AI_PROVIDER_STORAGE_KEY) ||
    (window.SITE_CONFIG && window.SITE_CONFIG.integration && window.SITE_CONFIG.integration.aiProvider) ||
    'anthropic';
}

// ---- Launch readiness: which placeholder values still need replacing before this
// is safe to show a real customer. Used by admin.html's checklist AND by the main
// page to auto-hide the "sample marketing site" footer disclaimer once everything's real. ----
function getReadinessChecks(){
  var cfg = window.SITE_CONFIG || {};
  var b = cfg.business || {};
  var addr = b.address || {};
  var integ = cfg.integration || {};
  var an = cfg.analytics || {};
  return [
    { label: 'n8n webhook URL', ok: getWebhookUrl().indexOf('YOUR-N8N-HOST') === -1 },
    { label: 'Google Calendar booking link', ok: getCalendarUrl().indexOf('YOUR-SCHEDULE-ID') === -1 },
    { label: 'Settings password changed from default', ok: (integ.settingsPassword || '') !== 'changeme' },
    { label: 'ABN', ok: (b.abn || '') !== '12 345 678 901' },
    { label: "Builder's licence number", ok: (b.builderLicence || '') !== 'XXXXXX' },
    { label: 'Electrical contractor licence number', ok: (b.electricalLicence || '') !== 'XXXXXX' },
    { label: 'Business address', ok: (addr.streetAddress || '') !== '1 Example Street' },
    { label: 'Google review count (used in structured data)', ok: (b.googleReviewCount || '') !== '1' },
    { label: 'Analytics connected (GA4 or Meta Pixel)', ok: (an.ga4MeasurementId && an.ga4MeasurementId.indexOf('XXXXXXXXXX') === -1) || (an.metaPixelId && an.metaPixelId.indexOf('000000000000000') === -1) }
  ];
}

function isLaunchReady(){
  return getReadinessChecks().every(function(c){ return c.ok; });
}

// The sample-site disclaimer is only useful while placeholder data is still live -
// once the essentials are real, showing "Sample marketing site" to actual customers
// would just look broken, so it hides itself automatically. No-ops safely on pages
// (like admin.html) that don't have this element.
function refreshSampleDisclaimer(){
  var el = document.getElementById('sampleSiteDisclaimer');
  if (!el) return;
  var essentials = getReadinessChecks().filter(function(c){
    return ['ABN', "Builder's licence number", 'Electrical contractor licence number', 'Business address'].indexOf(c.label) !== -1;
  });
  el.style.display = essentials.every(function(c){ return c.ok; }) ? 'none' : '';
}
