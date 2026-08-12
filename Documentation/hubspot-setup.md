# HubSpot setup — exact properties, pipeline, and private app

Do this once, before importing any n8n workflow. Everything below maps directly to
field names the workflows already reference — use these exact internal names or the
workflows will fail silently (HubSpot just won't save a property it doesn't recognise).

## 1. Create the private app (this is your API key)

1. HubSpot → Settings (gear icon) → Integrations → Private Apps → Create a private app.
2. Name it "n8n Automation".
3. Under Scopes, enable:
   - `crm.objects.contacts.read`, `crm.objects.contacts.write`
   - `crm.objects.deals.read`, `crm.objects.deals.write`
   - `crm.objects.notes.read`, `crm.objects.notes.write`
   - `crm.schemas.contacts.read`, `crm.schemas.deals.read`
4. Create app → copy the access token → this is `HUBSPOT_TOKEN` in `.env`.
5. Your portal ID is the number in your HubSpot URL (`app.hubspot.com/contacts/12345678/...`) → `HUBSPOT_PORTAL_ID`.

**A private app cannot receive HubSpot webhooks on the free plan** — that's why the
workflows poll on a schedule (every 15 minutes / daily) instead of reacting instantly
to HubSpot changes. It's a deliberate design choice, not an oversight.

## 2. Contact properties to create

Settings → Properties → Contact properties → Create property. Free tier caps custom
properties (10 was the confirmed limit at time of writing, verify your own portal's
current cap under Properties before creating all of these — HubSpot has changed this
before). These 10 are the ones the automation actually branches on; everything else
(owner-occupier answer, roof/bill notes, timeframe, full conversation detail) is saved
as a **Note** on the contact instead, which doesn't count against the cap.

| Internal name | Label | Type | Options |
|---|---|---|---|
| `lead_source` | Lead Source | Dropdown | facebook_ig, website, telegram, whatsapp, google_lsa, missed_call, referral |
| `lead_score` | Lead Score | Dropdown | hot, warm, cold, unqualified |
| `job_type` | Job Type | Dropdown | repair, restoration, reroof, solar, solar_battery, unknown |
| `urgency` | Urgency | Dropdown | emergency, planning, unknown |
| `preferred_channel` | Preferred Channel | Dropdown | telegram, meta, instagram, whatsapp, website, sms |
| `external_chat_id` | External Chat ID | Single-line text | — (format: `telegram:123456`, `whatsapp:+61...`, etc — the AI agent writes this, don't edit by hand) |
| `financing_interest` | Financing Interest | Single checkbox | — |
| `drip_stage` | Drip Stage | Dropdown | day0, day1, day3, day7, day14, monthly, booked, stopped |
| `last_ai_contact_at` | Last AI Contact At | Date picker (with time) | — |
| `storm_lead` | Storm Lead | Single checkbox | — |

Suburb and postcode reuse HubSpot's built-in `city` and `zip` properties — don't create
new ones for these.

## 3. Deal properties to create

Same property screen, switch object type to "Deal". Also aim to stay at or under your
portal's custom property cap.

| Internal name | Label | Type | Options |
|---|---|---|---|
| `appointment_datetime` | Appointment Date/Time | Date picker (with time) | — |
| `confirmation_sent` | Confirmation Sent | Single checkbox | — |
| `reminder_24h_sent` | 24h Reminder Sent | Single checkbox | — |
| `reminder_1h_sent` | 1h Reminder Sent | Single checkbox | — |
| `review_requested` | Review Requested | Single checkbox | — |
| `loss_reason` | Loss Reason | Dropdown | no_show, price_objection, timing, chose_competitor, other |
| `recovery_touches` | Recovery Touches | Number | — |
| `last_recovery_sent` | Last Recovery Sent | Date picker (with time) | — |
| `quote_value` | Quote Value | Number (currency) | — |
| `stc_year_locked` | STC Year Locked | Number | — (solar only — the year the quoted rebate was based on) |

## 4. Pipeline — rename the default "Sales Pipeline"

Settings → Objects → Deals → Pipelines. Rename stages to exactly this, in this order
(the internal stage IDs HubSpot generates go into your `.env` file):

1. New Lead
2. Qualified – Ready to Book → `.env` → `HUBSPOT_STAGE_QUALIFIED`
3. Nurture – Cold → `.env` → `HUBSPOT_STAGE_NURTURE`
4. Appointment Booked → `.env` → `HUBSPOT_STAGE_BOOKED`
5. Quote Sent
6. Won → `.env` → `HUBSPOT_STAGE_WON`
7. Lost / No-show → `.env` → `HUBSPOT_STAGE_LOST`

To find a stage's internal ID: open the pipeline editor, click the stage, and check the
URL or use the API (`GET /crm/v3/pipelines/deals`) — the internal ID is usually a short
slug like `appointmentbooked`, not the display label.

## 5. Meetings tool — one link per rep/region

Settings → Objects → Meetings → create a meeting link per rep or per service region
(free tier: no round-robin, so this is the workaround). Note each link's URL — the AI
agent sends the right one based on the suburb the lead gave, matched however you decide
(a simple lookup table is easiest — add it to the "Parse Claude + Merge" code node in
workflow 1 if you want this automated, or have the AI agent just always send one main
link and let a human redirect for now).
