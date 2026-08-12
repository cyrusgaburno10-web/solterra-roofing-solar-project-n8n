/* ==========================================================================
   VERCEL EDGE MIDDLEWARE — locks down /admin.html at the hosting level.

   This runs on Vercel's edge, BEFORE admin.html's own HTML/JS is ever sent
   to a browser. Unlike the password prompt inside admin.html (client-side,
   an honest "casual deterrent"), this is real access control: a request
   that fails this check never receives the file at all.

   Setup (one-time, in the Vercel dashboard, not in this file):
     Project → Settings → Environment Variables → add both, then redeploy:
       ADMIN_BASIC_AUTH_USER   e.g. an operator username you choose
       ADMIN_BASIC_AUTH_PASS   a strong password - this one IS real security,
                                so don't reuse the admin.html "casual" one.

   If those two env vars are not set, every request is rejected (fails
   closed) - safer than accidentally leaving the page open.

   See Documentation/deploy-lockdown-guide.md for full walkthrough.
   ========================================================================== */

export const config = {
  matcher: "/admin.html",
};

export default function middleware(request) {
  const expectedUser = process.env.ADMIN_BASIC_AUTH_USER;
  const expectedPass = process.env.ADMIN_BASIC_AUTH_PASS;

  const authHeader = request.headers.get("authorization");

  if (authHeader && expectedUser && expectedPass) {
    const [scheme, encoded] = authHeader.split(" ");
    if (scheme === "Basic" && encoded) {
      const [user, pass] = atob(encoded).split(":");
      if (user === expectedUser && pass === expectedPass) {
        return; // credentials good - let the request through to admin.html
      }
    }
  }

  return new Response("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Settings"' },
  });
}
