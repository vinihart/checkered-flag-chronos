-- Fix linter issues: add RLS policies for user_roles and set search_path on function

-- 1) user_roles policies
alter table public.user_roles enable row level security;

drop policy if exists "Users can view own roles" on public.user_roles;
drop policy if exists "Admins manage roles" on public.user_roles;

create policy "Users can view own roles" on public.user_roles
for select using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));

create policy "Admins manage roles" on public.user_roles
for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- 2) Harden function search_path
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;