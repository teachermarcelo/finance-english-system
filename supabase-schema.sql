-- Extensão para UUID aleatório
create extension if not exists pgcrypto;

-- Tabela de alunos
create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  phone text,
  email text,
  enrollment_date date default current_date,
  monthly_fee numeric(10,2) not null default 0,
  due_day int not null check (due_day between 1 and 31),
  status text not null default 'ativo' check (status in ('ativo', 'inativo')),
  notes text,
  created_at timestamptz not null default now()
);

-- Tabela de mensalidades
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  competence text not null,
  amount numeric(10,2) not null default 0,
  due_date date not null,
  payment_date date,
  status text not null default 'pendente' check (status in ('pago', 'pendente', 'atrasado')),
  payment_method text,
  notes text,
  created_at timestamptz not null default now()
);

-- Tabela de entradas e saídas
create table if not exists public.financial_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('entrada', 'saida')),
  category text not null,
  description text not null,
  amount numeric(10,2) not null default 0,
  entry_date date not null default current_date,
  notes text,
  created_at timestamptz not null default now()
);

-- Tabela de links úteis
create table if not exists public.useful_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  url text not null,
  description text,
  created_at timestamptz not null default now()
);


-- Trigger para preencher user_id automaticamente
create or replace function public.set_user_id()
returns trigger
language plpgsql
security definer
as $$
begin
  if new.user_id is null then
    new.user_id := auth.uid();
  end if;
  return new;
end;
$$;

drop trigger if exists trg_students_set_user_id on public.students;
create trigger trg_students_set_user_id
before insert on public.students
for each row execute function public.set_user_id();

drop trigger if exists trg_payments_set_user_id on public.payments;
create trigger trg_payments_set_user_id
before insert on public.payments
for each row execute function public.set_user_id();

drop trigger if exists trg_financial_entries_set_user_id on public.financial_entries;
create trigger trg_financial_entries_set_user_id
before insert on public.financial_entries
for each row execute function public.set_user_id();

drop trigger if exists trg_useful_links_set_user_id on public.useful_links;
create trigger trg_useful_links_set_user_id
before insert on public.useful_links
for each row execute function public.set_user_id();

-- Índices recomendados
create index if not exists idx_students_user_id on public.students(user_id);
create index if not exists idx_payments_user_id on public.payments(user_id);
create index if not exists idx_payments_student_id on public.payments(student_id);
create index if not exists idx_financial_entries_user_id on public.financial_entries(user_id);
create index if not exists idx_useful_links_user_id on public.useful_links(user_id);

-- RLS
alter table public.students enable row level security;
alter table public.payments enable row level security;
alter table public.financial_entries enable row level security;
alter table public.useful_links enable row level security;

-- Policies students
drop policy if exists "students_select_own" on public.students;
create policy "students_select_own"
on public.students
for select
using (auth.uid() = user_id);

drop policy if exists "students_insert_own" on public.students;
create policy "students_insert_own"
on public.students
for insert
with check (auth.uid() = user_id);

drop policy if exists "students_update_own" on public.students;
create policy "students_update_own"
on public.students
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "students_delete_own" on public.students;
create policy "students_delete_own"
on public.students
for delete
using (auth.uid() = user_id);

-- Policies payments
drop policy if exists "payments_select_own" on public.payments;
create policy "payments_select_own"
on public.payments
for select
using (auth.uid() = user_id);

drop policy if exists "payments_insert_own" on public.payments;
create policy "payments_insert_own"
on public.payments
for insert
with check (auth.uid() = user_id);

drop policy if exists "payments_update_own" on public.payments;
create policy "payments_update_own"
on public.payments
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "payments_delete_own" on public.payments;
create policy "payments_delete_own"
on public.payments
for delete
using (auth.uid() = user_id);

-- Policies financial_entries
drop policy if exists "financial_entries_select_own" on public.financial_entries;
create policy "financial_entries_select_own"
on public.financial_entries
for select
using (auth.uid() = user_id);

drop policy if exists "financial_entries_insert_own" on public.financial_entries;
create policy "financial_entries_insert_own"
on public.financial_entries
for insert
with check (auth.uid() = user_id);

drop policy if exists "financial_entries_update_own" on public.financial_entries;
create policy "financial_entries_update_own"
on public.financial_entries
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "financial_entries_delete_own" on public.financial_entries;
create policy "financial_entries_delete_own"
on public.financial_entries
for delete
using (auth.uid() = user_id);

-- Policies useful_links
drop policy if exists "useful_links_select_own" on public.useful_links;
create policy "useful_links_select_own"
on public.useful_links
for select
using (auth.uid() = user_id);

drop policy if exists "useful_links_insert_own" on public.useful_links;
create policy "useful_links_insert_own"
on public.useful_links
for insert
with check (auth.uid() = user_id);

drop policy if exists "useful_links_update_own" on public.useful_links;
create policy "useful_links_update_own"
on public.useful_links
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "useful_links_delete_own" on public.useful_links;
create policy "useful_links_delete_own"
on public.useful_links
for delete
using (auth.uid() = user_id);
