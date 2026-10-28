-- Run once in Supabase → SQL Editor. Creates the table the website's enquiry form writes to.
create table if not exists public.enquiries (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          text not null,
  phone         text not null,
  email         text,
  city          text,
  wedding_date  date,
  date_flexible boolean not null default false,
  guests        text,
  ceremonies    text[],
  budget        text,
  message       text,
  venue_id      text,
  venue_name    text,
  source        text,
  page_url      text,
  status        text not null default 'new'   -- new / called / site visit / won / lost
);

alter table public.enquiries enable row level security;

-- Website visitors may ADD an enquiry, but nobody can read leads through the public key.
drop policy if exists "Website can submit enquiries" on public.enquiries;
create policy "Website can submit enquiries"
  on public.enquiries for insert
  to anon, authenticated
  with check (true);

-- View and manage leads in Supabase → Table Editor → enquiries (as the project owner).
