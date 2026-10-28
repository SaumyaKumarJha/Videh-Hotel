-- Run once in Supabase → SQL Editor. Lets the reception (signed in as videhhotels@gmail.com) read and update enquiries on /admin.
alter table public.enquiries add column if not exists internal_notes text;
alter table public.enquiries add column if not exists updated_at timestamptz;

drop policy if exists "Staff can read enquiries" on public.enquiries;
create policy "Staff can read enquiries" on public.enquiries for select to authenticated
  using ((auth.jwt() ->> 'email') in ('videhhotels@gmail.com'));

drop policy if exists "Staff can update enquiries" on public.enquiries;
create policy "Staff can update enquiries" on public.enquiries for update to authenticated
  using ((auth.jwt() ->> 'email') in ('videhhotels@gmail.com'))
  with check ((auth.jwt() ->> 'email') in ('videhhotels@gmail.com'));
-- To add another staff member, add their email inside the three quoted lists above and run again.
