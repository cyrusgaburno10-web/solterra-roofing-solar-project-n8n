/* ==========================================================================
   ANALYTICS.JS — Google Analytics 4 + Meta Pixel loaders, plus one
   trackEvent() helper used at every conversion point on the page.

   Both loaders are conditional: if config.js still has the placeholder ID,
   nothing loads - so an unconfigured deployment never sends broken traffic
   to a GA4 property or Pixel that isn't actually this site's.

   Scope note: this loads analytics immediately alongside a disclosure banner
   (see the cookie notice in the main page), not gated behind an explicit
   consent click. That matches common AU practice for a site with no EU
   audience. If this site serves EU visitors, or you want stricter
   consent-gating, that's a bigger change than what's built here - ask
   before assuming this is sufficient for that case.
   ========================================================================== */

(function () {
  var cfg = (window.SITE_CONFIG && window.SITE_CONFIG.analytics) || {};

  function isConfigured(id, placeholderMarker) {
    return !!id && id.indexOf(placeholderMarker) === -1;
  }

  // ---- Google Analytics 4 ----
  if (isConfigured(cfg.ga4MeasurementId, 'XXXXXXXXXX')) {
    var gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + cfg.ga4MeasurementId;
    document.head.appendChild(gaScript);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', cfg.ga4MeasurementId);
  }

  // ---- Meta Pixel ----
  if (isConfigured(cfg.metaPixelId, '000000000000000')) {
    (function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = true; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', cfg.metaPixelId);
    window.fbq('track', 'PageView');
  }

  // ---- Unified event helper ----
  // Call trackEvent('quote_form_submit') from anywhere on the page. Maps each
  // internal event name to GA4's recommended name and Meta's standard event
  // name where one exists, so both ad platforms can actually learn from real
  // conversions instead of only counting pageviews.
  var EVENT_MAP = {
    quote_form_submit: { ga4: 'generate_lead', meta: 'Lead' },
    chat_engaged: { ga4: 'chat_engagement', meta: 'Contact' },
    calendar_click: { ga4: 'schedule_click', meta: 'Schedule' },
    phone_click: { ga4: 'phone_click', meta: 'Contact' }
  };

  window.trackEvent = function (name, params) {
    var mapped = EVENT_MAP[name] || { ga4: name, meta: null };
    if (window.gtag) window.gtag('event', mapped.ga4, params || {});
    if (window.fbq && mapped.meta) window.fbq('track', mapped.meta, params || {});
  };
})();
