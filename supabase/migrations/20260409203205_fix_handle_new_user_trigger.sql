/*
  # Fix handle_new_user trigger

  ## Problem
  The trigger was inserting into profiles without handling conflicts.
  If a signup fails partway and is retried, or if the email unique constraint
  is hit, Supabase surfaces "Database error saving new user".

  ## Changes
  - Rewrite handle_new_user to use INSERT ... ON CONFLICT DO NOTHING
  - Also insert role from user_metadata so the profiles.role column is populated
*/

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'name',
    coalesce(new.raw_user_meta_data->>'role', 'customer')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;
