-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- TAL rates table (seed data included)
create table tal_rates (
  id uuid primary key default uuid_generate_v4(),
  year integer unique not null,
  base_rate_pct decimal(5,4) not null,
  effective_date date not null,
  notes text,
  created_at timestamptz default now()
);
insert into tal_rates (year, base_rate_pct, effective_date, notes) values
  (2024, 0.028, '2024-01-01', 'Taux IPC 2024'),
  (2025, 0.045, '2025-01-01', 'Taux IPC 2025 — hausse exceptionnelle'),
  (2026, 0.031, '2026-01-01', 'Nouveau taux IPC moyen 3 ans');

-- Properties
create table properties (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  civic_number text not null,
  street text not null,
  city text not null,
  postal_code text,
  province text default 'QC',
  building_type text default 'plex',
  notes text,
  created_at timestamptz default now()
);
alter table properties enable row level security;
create policy "Users manage own properties" on properties for all using (auth.uid() = user_id);

-- Units
create table units (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid references properties(id) on delete cascade not null,
  unit_number text not null,
  bedrooms integer default 2,
  is_heated boolean default false,
  is_furnished boolean default false,
  created_at timestamptz default now()
);
alter table units enable row level security;
create policy "Users manage own units" on units for all using (
  exists (select 1 from properties where properties.id = units.property_id and properties.user_id = auth.uid())
);

-- Tenants
create table tenants (
  id uuid primary key default uuid_generate_v4(),
  unit_id uuid references units(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  is_active boolean default true,
  created_at timestamptz default now()
);
alter table tenants enable row level security;
create policy "Users manage own tenants" on tenants for all using (auth.uid() = user_id);

-- Leases
create table leases (
  id uuid primary key default uuid_generate_v4(),
  unit_id uuid references units(id) on delete cascade not null,
  tenant_id uuid references tenants(id) on delete cascade not null,
  start_date date not null,
  end_date date not null,
  current_rent decimal(10,2) not null,
  is_heated_included boolean default false,
  is_active boolean default true,
  notes text,
  created_at timestamptz default now()
);
alter table leases enable row level security;
create policy "Users manage own leases" on leases for all using (
  exists (
    select 1 from units
    join properties on properties.id = units.property_id
    where units.id = leases.unit_id and properties.user_id = auth.uid()
  )
);

-- Rent increases
create table rent_increases (
  id uuid primary key default uuid_generate_v4(),
  lease_id uuid references leases(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  calculation_year integer not null,
  current_rent decimal(10,2) not null,
  base_rate_pct decimal(5,4) not null,
  tax_increase_amount decimal(10,2) default 0,
  insurance_increase_amount decimal(10,2) default 0,
  renovation_cost decimal(10,2) default 0,
  renovation_units_affected integer default 1,
  proposed_increase_amount decimal(10,2) not null,
  proposed_increase_pct decimal(5,4) not null,
  new_rent decimal(10,2) not null,
  status text default 'draft' check (status in ('draft','notice_sent','accepted','refused','tal_filed')),
  notice_sent_date date,
  tenant_response_deadline date,
  tenant_response text,
  tenant_response_date date,
  tal_filing_deadline date,
  tal_filed_date date,
  notes text,
  created_at timestamptz default now()
);
alter table rent_increases enable row level security;
create policy "Users manage own rent increases" on rent_increases for all using (auth.uid() = user_id);

-- Documents
create table documents (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  lease_id uuid references leases(id) on delete set null,
  rent_increase_id uuid references rent_increases(id) on delete set null,
  document_type text not null,
  file_name text not null,
  storage_path text not null,
  created_at timestamptz default now()
);
alter table documents enable row level security;
create policy "Users manage own documents" on documents for all using (auth.uid() = user_id);
