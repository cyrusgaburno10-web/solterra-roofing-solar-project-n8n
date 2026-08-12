/* ==========================================================================
   NETLIFY EDGE FUNCTION — locks down /admin.html at the hosting level.

   Same purpose as middleware.js (the Vercel version): runs before
   admin.html's own HTML/JS is ever sent to a browser, so a request that
   fails this check never receives the file at all. This is real access
   control, unlike the password prompt inside admin.html itself.

   Setup (one-time, in the Netlify dashboard, not in this file):
     Site configuration → Environment variables → add both, then redeploy:
       ADMIN_BASIC_AUTH_USER   e.g. an operator username you choose
       ADMIN_BASIC_AUTH_PASS   a strong password - this one IS real security,
                                so don't reuse the admin.html "casual" one.

   If those two env vars are not set, every request is rejected (fails
   closed) - safer than accidentally leaving the page open.

   This file only needs to exist under netlify/edge-functions/ - Netlify
   auto-detects it. The `config.path` export below is what wires it to
   /admin.html specifically; no separate netlify.toml entry is required for
   that, though one is included anyway for clarity/explicitness.

   See Documentation/deploy-lockdown-guide.md for full walkthrough.
   ========================================================================== */

export default async (request, context) => {
  const expectedUser = Deno.env.get("ADMIN_BASIC_AUTH_USER");
  const expectedPass = Deno.env.get("ADMIN_BASIC_AUTH_PASS");

  const authHeader = request.headers.get("authorization");

  if (authHeader && expectedUser && expectedPass) {
    const [scheme, encoded] = authHeader.split(" ");
    if (scheme === "Basic" && encoded) {
      const [user, pass] = atob(encoded).split(":");
      if (user === expectedUser && pass === expectedPass) {
        return context.next(); // credentials good - serve admin.html
      }
    }
  }

  return new Response("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Settings"' },
  });
};

export const config = { path: "/admin.html" };
