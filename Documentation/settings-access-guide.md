# Accessing the site settings

The settings that control where leads go, how bookings work, and which AI model
answers live on their own separate page — **`admin.html`** — completely apart from
the main website. Nothing about the settings tool is present anywhere on the actual
site visitors see: no link, no button, no trace in the page's code. You reach it only
by knowing its address, and it's password-protected on top of that.

This takes about 2 minutes to set up, and no coding is involved — just editing one
line in a text file.

## Step 1 — set your own password

1. Open the `Website` folder, and open the file called `config.js` in any plain text
   editor (Notepad on Windows, TextEdit on Mac — set TextEdit to "plain text" mode if
   asked, not "rich text").
2. Use Find (Ctrl+F / Cmd+F) to search for: `settingsPassword`
3. You'll see this line:
   ```
   settingsPassword: "changeme"
   ```
4. Replace the word `changeme` with a password only you know — keep the quote marks
   around it exactly as they are. For example:
   ```
   settingsPassword: "MySecret2026"
   ```
5. Save the file (Ctrl+S / Cmd+S).

## Step 2 — open the settings page

1. Go to `admin.html` directly — take your normal website address and replace the
   main page's filename with `admin.html`. For example, if your site is:
   `https://yoursite.com.au/solterra-landing-au-solarfirst.html`
   then settings are at:
   `https://yoursite.com.au/admin.html`
2. **Bookmark that page** — since nothing on the actual website links to it, this is
   the only way you'll get back to it besides typing it again.
3. Type your password from Step 1 → click **Unlock**.
4. You'll see the same controls as before — a Launch Readiness checklist, the n8n
   webhook, the calendar link, and the AI model — just on their own dedicated page
   now, not mixed into the site itself.

## Step 3 — staying unlocked, or locking it again

- Once unlocked, `admin.html` **stays unlocked on that browser** until you lock it
  again — you won't need to type the password every time you visit from the same
  computer.
- To lock it again (recommended on a shared or public computer): click **🔒 Lock and
  exit** at the top of the page.
- On a different computer, phone, or browser, you'll need to unlock it there too —
  the "unlocked" state doesn't follow you between devices.

## Why a separate page instead of a button on the site

Earlier this lived behind a hidden button on the main site itself. It's been moved
to its own page instead, because even a hidden, password-locked button still ships
its code to every visitor's browser — anyone who looked at the page's source code
(right-click → "Inspect") could see that a settings panel existed, even without ever
unlocking it. Splitting it into a completely separate file means the actual sales
funnel page carries **zero trace** of any settings tooling — cleaner, and more
appropriate for a page whose only job is to convert visitors into leads.

## What this does and doesn't protect

- ✅ The main website carries no code, no button, and no hint that a settings page
  exists anywhere.
- ✅ Nobody can see or change your settings without the password.
- ✅ The important secrets — your actual AI and CRM login keys — are never stored in
  either page at all. They live only inside n8n, which is why this doesn't need to be
  bank-level security to be good enough.
- ❌ This is **not** proof against someone who deliberately finds and reads
  `admin.html`'s or `config.js`'s file contents — a technical person could still find
  the password there. That's an acceptable trade-off *only* because nothing more
  sensitive than a webhook address and a calendar link sits behind it. Never be
  talked into putting anything more sensitive (an actual API key, a real password to
  another system) into `config.js`.

## If you forget the password

Open `config.js` again (Step 1) — the password is sitting right there in plain text
for you to read or change. There's no "forgot password" flow to worry about, because
there's no account system behind this — it's just a text file on your own computer.
