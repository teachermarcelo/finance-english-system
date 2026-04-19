-- Rode isso no SQL Editor do Supabase

alter table public.students enable row level security;
alter table public.payments enable row level security;
alter table public.financial_entries enable row level security;
alter table public.useful_links enable row level security;

drop policy if exists "students_select_own" on public.students;
drop policy if exists "students_insert_own" on public.students;
drop policy if exists "students_update_own" on public.students;
drop policy if exists "students_delete_own" on public.students;

create policy "students_select_own" on public.students for select using (auth.uid() = user_id);
create policy "students_insert_own" on public.students for insert with check (auth.uid() = user_id);
create policy "students_update_own" on public.students for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "students_delete_own" on public.students for delete using (auth.uid() = user_id);

drop policy if exists "payments_select_own" on public.payments;
drop policy if exists "payments_insert_own" on public.payments;
drop policy if exists "payments_update_own" on public.payments;
drop policy if exists "payments_delete_own" on public.payments;

create policy "payments_select_own" on public.payments for select using (auth.uid() = user_id);
create policy "payments_insert_own" on public.payments for insert with check (auth.uid() = user_id);
create policy "payments_update_own" on public.payments for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "payments_delete_own" on public.payments for delete using (auth.uid() = user_id);

drop policy if exists "financial_entries_select_own" on public.financial_entries;
drop policy if exists "financial_entries_insert_own" on public.financial_entries;
drop policy if exists "financial_entries_update_own" on public.financial_entries;
drop policy if exists "financial_entries_delete_own" on public.financial_entries;

create policy "financial_entries_select_own" on public.financial_entries for select using (auth.uid() = user_id);
create policy "financial_entries_insert_own" on public.financial_entries for insert with check (auth.uid() = user_id);
create policy "financial_entries_update_own" on public.financial_entries for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "financial_entries_delete_own" on public.financial_entries for delete using (auth.uid() = user_id);

drop policy if exists "useful_links_select_own" on public.useful_links;
drop policy if exists "useful_links_insert_own" on public.useful_links;
drop policy if exists "useful_links_update_own" on public.useful_links;
drop policy if exists "useful_links_delete_own" on public.useful_links;

create policy "useful_links_select_own" on public.useful_links for select using (auth.uid() = user_id);
create policy "useful_links_insert_own" on public.useful_links for insert with check (auth.uid() = user_id);
create policy "useful_links_update_own" on public.useful_links for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "useful_links_delete_own" on public.useful_links for delete using (auth.uid() = user_id);
