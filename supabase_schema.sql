-- Tabela de Vendas
create table if not exists public.sales (
  id text primary key,
  user_id uuid not null references auth.users(id),
  client_name text not null,
  sale_date date not null,
  project text,
  sale_value numeric,
  commission_total numeric,
  raw_data jsonb, 
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabela de Produtos (Multipropriedade)
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  title text not null,
  location text,
  price numeric not null,
  bedrooms integer default 1,
  weeks integer default 1,
  capacity integer default 4,
  area numeric,
  bathrooms integer default 1,
  parking integer default 0,
  commission_type text check (commission_type in ('fixed', 'percentage')),
  commission_value numeric not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS
alter table public.sales enable row level security;
alter table public.products enable row level security;

-- Políticas de Segurança (Vendas)
create policy "Users can view their own sales" on public.sales for select using (auth.uid() = user_id);
create policy "Users can insert their own sales" on public.sales for insert with check (auth.uid() = user_id);
create policy "Users can update their own sales" on public.sales for update using (auth.uid() = user_id);
create policy "Users can delete their own sales" on public.sales for delete using (auth.uid() = user_id);

-- Políticas de Segurança (Produtos)
create policy "Users can view their own products" on public.products for select using (auth.uid() = user_id);
create policy "Users can insert their own products" on public.products for insert with check (auth.uid() = user_id);
create policy "Users can update their own products" on public.products for update using (auth.uid() = user_id);
create policy "Users can delete their own products" on public.products for delete using (auth.uid() = user_id);