# Locking down admin.html when you go live (Vercel + Netlify)

This is Option A from the settings-access discussion: `admin.html` deploys
live alongside the main site, but the *hosting platform itself* blocks
anyone from reaching it unless they know a username and password. That
check happens before the page is ever sent to a browser — it's a real gate,
not the "casual deterrent" the password prompt inside `admin.html` itself
is (see `settings-access-guide.md`). You end up with two layers: the host
blocks the request, and if it somehow got through, `admin.html`'s own
prompt would ask again.

Two files already do the work — you're just switching them on and setting
a username/password in your hosting provider's dashboard:

- `Website/middleware.js` — for Vercel
- `Website/netlify/edge-functions/admin-auth.js` + `Website/netlify.toml` — for Netlify

You only need the one matching whichever platform you deploy to. Having
both in the folder is harmless — Vercel ignores the Netlify files and vice
versa.

## Before either platform: pick real credentials

Unlike the `settingsPassword` in `config.js` (openly admitted to be a light
deterrent, since anyone can read that file's contents), this username and
password are enforced server-side and never shipped to the browser. Pick a
proper password here — not the same one you already use for admin.html's
own prompt, and not `changeme`/`admin`/etc. A password manager's generated
password is fine; you'll only need to type it occasionally.

## Option 1: Vercel (primary)

1. Deploy the `Website/` folder to Vercel as you normally would (connect
   the repo, or `vercel deploy` from inside `Website/`). Vercel will detect
   `middleware.js` at the project root automatically — no framework needed,
   it works on a plain static deployment.
2. In the Vercel dashboard: **Project → Settings → Environment Variables**.
   Add two variables:
   - `ADMIN_BASIC_AUTH_USER` → the username you picked
   - `ADMIN_BASIC_AUTH_PASS` → the password you picked
   Set them for the **Production** environment (add to Preview too if you
   want previews locked down as well).
3. Redeploy (env var changes need a fresh deploy to take effect — Vercel
   will prompt you, or trigger one from the dashboard).
4. Visit `https://your-domain.com/admin.html`. Your browser should pop up
   its own native username/password box before anything else loads. Enter
   the credentials from step 2 — then you'll land on admin.html's own
   password prompt as before.

If you ever see the page load with *no* browser prompt at all, stop and
check step 2/3 — that means the env vars aren't set, and depending on how
your Vercel project is configured, treat that as "the gate isn't active,"
not "it's open by default." (The middleware is written to fail closed —
reject everything — if the env vars are missing, but always verify rather
than assume.)

## Option 2: Netlify (secondary)

1. Deploy the `Website/` folder to Netlify (drag-and-drop, CLI, or
   Git-connected — any method). Netlify reads `netlify.toml` for the
   publish directory and auto-detects the edge function under
   `netlify/edge-functions/`.
2. In the Netlify dashboard: **Site configuration → Environment
   variables**. Add the same two:
   - `ADMIN_BASIC_AUTH_USER`
   - `ADMIN_BASIC_AUTH_PASS`
3. Trigger a redeploy (env var changes require one, same as Vercel).
4. Visit `https://your-domain.com/admin.html` and confirm the browser's
   native username/password prompt appears before the page loads.

Netlify also sells a point-and-click "Password Protection" feature under
Site configuration → Visitor access, but it's gated to paid plans and
protects at the *site* level (or via its own path rules), not something
you configure through a code file. The edge function above works on
Netlify's free tier and only touches `/admin.html`, leaving the rest of
the site public — that's why it's the one set up here. If you're already
on a paid Netlify plan and would rather use their built-in UI instead of
the edge function, that's a reasonable swap; just remove
`netlify/edge-functions/admin-auth.js` and `netlify.toml`'s
`[[edge_functions]]` block so the two mechanisms don't overlap.

## Other hosts

Deploying somewhere else entirely (Cloudflare Pages, GitHub Pages, a plain
VPS)? The same idea applies but the mechanism differs:
- **Cloudflare Pages** → Cloudflare Access (Zero Trust) can gate a single
  path the same way.
- **GitHub Pages** → can't do this at all; it's pure static hosting with no
  request-time code. Don't publish `admin.html` on GitHub Pages under
  Option A — use Option B (never deploy it) instead if that's your host.
- **A VPS with Nginx/Apache** → standard HTTP Basic Auth (`.htpasswd`) on
  the `/admin.html` location block — the oldest version of this same idea.

## Mistakes that actually happened during setup (learn from these)

- **The Key field in "Add Environment Variable" must be the literal text
  `ADMIN_BASIC_AUTH_USER`** — not the username itself. It's easy to
  accidentally type your chosen username into the Key box and your password
  into the Value box, leaving no variable named `ADMIN_BASIC_AUTH_USER` at
  all. If Vercel/Netlify flag the Key as "invalid," that's usually why —
  you're trying to use a value as a variable name.
- **The homepage 404'd on first deploy** because this site's homepage file
  isn't named `index.html` (kept as `solterra-landing-au-solarfirst.html`
  on purpose, for local `file://` testing and the docs that reference it).
  `Website/vercel.json` and the `[[redirects]]` block in `Website/netlify.toml`
  both rewrite `/` to that file — already fixed, but if you ever rename the
  homepage file, update the rewrite target in both places too.
- **If you set up the Vercel CLI locally**, run `vercel link` and
  `vercel --prod` from the **repo root**, not from inside `Website/` — the
  project's Root Directory setting (`Website`) is relative to wherever you
  link from, so linking from inside `Website/` makes it look for a
  nonexistent `Website/Website`.
- **If credentials stop working and you can't tell why**: env vars marked
  "Sensitive" in Vercel can't be read back, even via `vercel env pull` (the
  value just shows as hidden). Don't try to guess what's wrong — remove
  both (`vercel env rm ADMIN_BASIC_AUTH_USER production`, same for `_PASS`
  and for the `preview` environment) and re-add them fresh with
  `vercel env add`, then redeploy. Faster than debugging a value you can't see.

## After this is live

- Bookmark `https://your-domain.com/admin.html` — it's still not linked
  from the site anywhere, so the bookmark (or typing the URL) is the only
  way in for you, same as before.
- The credentials from this guide are separate from `settingsPassword` in
  `config.js`. Changing one doesn't change the other.
- If you ever rotate the host-level password, no redeploy of the *site* is
  needed — just update the env var and redeploy (Vercel/Netlify both
  redeploy in under a minute).
