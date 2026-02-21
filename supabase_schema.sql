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

-- Tabela de Checkouts (Pedidos do Site)
create table if not exists public.checkouts (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text not null,
  plan_name text not null,
  amount numeric not null,
  status text default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS para Checkouts
alter table public.checkouts enable row level security;

-- Políticas para Checkouts (Público pode inserir, Admin pode ver)
create policy "Anyone can insert checkouts" on public.checkouts for insert with check (true);
create policy "Admins can view all checkouts" on public.checkouts for select using (
  exists (
    select 1 from auth.users
    where auth.users.id = auth.uid()
    and (auth.users.raw_user_meta_data->>'role' = 'admin' or auth.users.email like '%admin%')
  )
);

-- Tabela de Pedidos (Orders)
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  registration_date timestamp with time zone default timezone('utc'::text, now()) not null,
  subscription_date timestamp with time zone,
  expiration_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS para Orders
alter table public.orders enable row level security;

-- Políticas para Orders (Admin pode ver tudo)
create policy "Admins can view all orders" on public.orders for select using (
  exists (
    select 1 from auth.users
    where auth.users.id = auth.uid()
    and (auth.users.raw_user_meta_data->>'role' = 'admin' or auth.users.email like '%admin%')
  )
);
