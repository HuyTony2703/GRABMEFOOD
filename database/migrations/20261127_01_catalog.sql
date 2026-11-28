-- GrabMeFood GRAB-5 — catalog domain.
-- DRAFT: not applied to Supabase Cloud until the owner approves the gate in
-- docs/DATABASE.md. Do not edit after this migration has run anywhere.

create table public.areas (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name_vi text not null check (length(btrim(name_vi)) between 1 and 160),
  name_en text not null check (length(btrim(name_en)) between 1 and 160),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.restaurants (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name_vi text not null check (length(btrim(name_vi)) between 1 and 200),
  name_en text not null check (length(btrim(name_en)) between 1 and 200),
  description_vi text not null default '',
  description_en text not null default '',
  address text not null check (length(btrim(address)) between 1 and 500),
  map_url text,
  latitude numeric(9, 6) check (latitude between -90 and 90),
  longitude numeric(9, 6) check (longitude between -180 and 180),
  is_public boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint restaurants_public_requires_published_at
    check (not is_public or published_at is not null)
);

create index restaurants_public_idx on public.restaurants (published_at desc)
  where is_public;

create table public.dishes (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null
    references public.restaurants (id) on delete cascade,
  name_vi text not null check (length(btrim(name_vi)) between 1 and 200),
  name_en text not null check (length(btrim(name_en)) between 1 and 200),
  description_vi text not null default '',
  description_en text not null default '',
  price_vnd integer check (price_vnd >= 0),
  is_public boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint dishes_public_requires_published_at
    check (not is_public or published_at is not null)
);

create index dishes_restaurant_idx on public.dishes (restaurant_id);
create index dishes_public_idx on public.dishes (published_at desc)
  where is_public;

create table public.restaurant_areas (
  restaurant_id uuid not null
    references public.restaurants (id) on delete cascade,
  area_id uuid not null
    references public.areas (id) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (restaurant_id, area_id)
);

create index restaurant_areas_area_idx on public.restaurant_areas (area_id);

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title_vi text not null check (length(btrim(title_vi)) between 1 and 200),
  title_en text not null check (length(btrim(title_en)) between 1 and 200),
  body_vi text not null default '',
  body_en text not null default '',
  is_public boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint articles_public_requires_published_at
    check (not is_public or published_at is not null)
);

create table public.editorial_selections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title_vi text not null check (length(btrim(title_vi)) between 1 and 200),
  title_en text not null check (length(btrim(title_en)) between 1 and 200),
  description_vi text not null default '',
  description_en text not null default '',
  is_public boolean not null default false,
  published_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint editorial_selections_public_requires_published_at
    check (not is_public or published_at is not null)
);

create table public.selection_items (
  selection_id uuid not null
    references public.editorial_selections (id) on delete cascade,
  item_kind text not null check (item_kind in ('restaurant', 'dish')),
  item_id uuid not null,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  primary key (selection_id, item_kind, item_id)
);

create index selection_items_target_idx
  on public.selection_items (item_kind, item_id);

-- Shared updated_at trigger used by every table that has the column.
create function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

revoke all on function public.touch_updated_at() from public, anon, authenticated;

create trigger areas_touch_updated_at
  before update on public.areas
  for each row execute function public.touch_updated_at();

create trigger restaurants_touch_updated_at
  before update on public.restaurants
  for each row execute function public.touch_updated_at();

create trigger dishes_touch_updated_at
  before update on public.dishes
  for each row execute function public.touch_updated_at();

create trigger articles_touch_updated_at
  before update on public.articles
  for each row execute function public.touch_updated_at();

create trigger editorial_selections_touch_updated_at
  before update on public.editorial_selections
  for each row execute function public.touch_updated_at();
