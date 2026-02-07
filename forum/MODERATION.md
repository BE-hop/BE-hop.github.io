# Forum Moderation Workflow (Static Site)

This forum remains a static site, but comments and visit events can still be stored, reviewed, and published.

## 1. Data Flow

1. Browser submits new comment/event to external pending endpoints.
2. You review pending records in your backend panel.
3. Approved records are exported to static JSON files in this repo:
   - `assets/data/forum-comments-approved.json`
   - `assets/data/forum-events-approved.json`
4. Run metrics build:
   - `npm run forum:metrics`
5. Commit JSON updates and redeploy. Site only shows approved data.

## 2. Frontend Config

Edit `js/forum-config.js` and set:

- `commentSubmitUrl`: endpoint for new pending comments
- `eventSubmitUrl`: endpoint for new pending events
- `supabasePublishableKey`: required when `commentSubmitUrl` / `eventSubmitUrl` use Supabase REST (`/rest/v1/...`)

Keep secrets on backend only. Do not put service keys in frontend.

### Supabase REST quick setup

For your current `comments` table, you can set:

- `commentSubmitUrl: "https://<project-ref>.supabase.co/rest/v1/comments"`
- `supabasePublishableKey: "<sb_publishable_...>"`

The frontend will map payload to table columns:

- `content`
- `author`
- `status` (forced to `pending`)
- `location`
- `page`

Enable RLS + policies for moderated flow:

```sql
alter table public.comments enable row level security;

create policy "anon insert pending comments"
on public.comments
for insert
to anon
with check (status = 'pending');

create policy "anon select approved comments"
on public.comments
for select
to anon
using (status = 'approved');
```

## 3. Payload Contract

### Comment submit payload

```json
{
  "topicSlug": "aitalk-design-copilot",
  "topicTitle": "AI Talk: ...",
  "authorName": "Avery",
  "location": "San Diego, CA",
  "message": "Great article",
  "language": "zh",
  "timezone": "America/Los_Angeles",
  "pagePath": "/forum/topic/?topic=aitalk-design-copilot",
  "visitorId": "uuid",
  "sessionId": "uuid",
  "submittedAt": "2026-02-06T10:00:00Z"
}
```

### Event submit payload

```json
{
  "eventType": "page_view",
  "page": "forum_topic",
  "topicSlug": "aitalk-design-copilot",
  "pagePath": "/forum/topic/?topic=aitalk-design-copilot",
  "referrer": "...",
  "language": "en-US",
  "timezone": "America/Los_Angeles",
  "userAgent": "...",
  "visitorId": "uuid",
  "sessionId": "uuid",
  "submittedAt": "2026-02-06T10:00:00Z"
}
```

## 4. Approved Files

- `forum-comments-approved.json`: only approved comments.
- `forum-events-approved.json`: only approved visit events.
- `forum-metrics-approved.json`: generated summary used by pages.

Recommended publish flow:

1. Sync approved comments from Supabase:
   - `npm run forum:sync-comments`
2. Rebuild metrics snapshot:
   - `npm run forum:metrics`
3. Build site and deploy:
   - `bundle exec jekyll build`

## 6. GitHub Actions Automation

Workflow file:

- `.github/workflows/forum-sync-comments.yml`

It runs every 30 minutes (and manual trigger), then:

1. Pulls approved comments from Supabase
2. Rebuilds `forum-metrics-approved.json`
3. Commits snapshot changes automatically

Required repo secrets:

- `FORUM_COMMENT_SUBMIT_URL` (for example `https://<project-ref>.supabase.co/rest/v1/comments`)
- `SUPABASE_SERVICE_ROLE_KEY`

Sync script now reads backend credentials from environment only. In GitHub Actions, provide both repository secrets above.

## 7. Quick Review SQL

```sql
-- View pending comments
select id, created_at, author, location, page, content
from public.comments
where status = 'pending'
order by created_at desc;

-- Approve one
update public.comments
set status = 'approved'
where id = 123;

-- Reject one
update public.comments
set status = 'rejected'
where id = 123;

-- Approve all pending (bulk)
update public.comments
set status = 'approved'
where status = 'pending';

-- Reject all pending (bulk)
update public.comments
set status = 'rejected'
where status = 'pending';
```

## 5. Suggested Backend Tables

- `forum_pending_comments`
- `forum_pending_events`
- `forum_approved_comments` (optional if you prefer DB as source)
- `forum_approved_events` (optional)

You can use Supabase, Firebase, or another service. The static site only depends on approved JSON snapshots.
