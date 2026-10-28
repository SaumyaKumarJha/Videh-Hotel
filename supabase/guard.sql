-- Run once in Supabase → SQL Editor. Protects the enquiries table from junk and floods.
-- 1) Only sensible values are accepted.
alter table public.enquiries drop constraint if exists enquiries_sane;
alter table public.enquiries add constraint enquiries_sane check (
  char_length(name) between 2 and 100
  and phone ~ '^[6-9][0-9]{9}$'
  and coalesce(char_length(email), 0) <= 254
  and coalesce(char_length(message), 0) <= 2000
  and coalesce(char_length(page_url), 0) <= 500
  and coalesce(array_length(ceremonies, 1), 0) <= 8
);

-- 2) Flood limits, enforced inside the database (cannot be skipped by calling the API directly):
--    at most 25 enquiries per 10 minutes for the whole site, and 3 per hour per phone number.
create or replace function public.enquiries_guard() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.enquiries where created_at > now() - interval '10 minutes') >= 25 then
    raise exception 'Too many enquiries right now. Please try again in a few minutes.';
  end if;
  if (select count(*) from public.enquiries where phone = new.phone and created_at > now() - interval '1 hour') >= 3 then
    raise exception 'We already have your enquiry. Our team will call you soon.';
  end if;
  return new;
end $$;

drop trigger if exists enquiries_guard_trg on public.enquiries;
create trigger enquiries_guard_trg before insert on public.enquiries
  for each row execute function public.enquiries_guard();
