-- GrabMeFood GRAB-5 — collection domain.
-- DRAFT: not applied to Supabase Cloud until the owner approves the gate in
-- docs/DATABASE.md.

create table public.collections (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('restaurant', 'dish')),
  name text not null check (length(btrim(name)) between 1 and 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Composite key so saved_items cannot mix a dish collection with a
  -- restaurant target (BR-SAV-01) without a trigger.
  unique (id, kind)
);

create index collections_owner_idx on public.collections (owner_id, kind);

create table public.saved_items (
  collection_id uuid not null,
  target_kind text not null check (target_kind in ('restaurant', 'dish')),
  target_id uuid not null,
  saved_at timestamptz not null default now(),
  primary key (collection_id, target_kind, target_id),
  foreign key (collection_id, target_kind)
    references public.collections (id, kind) on delete cascade
);

-- Deliberately no FK to restaurants/dishes: hiding or deleting the target must
-- keep a private marker (BR-LIFE-02) without retaining the target payload.
create index saved_items_target_idx
  on public.saved_items (target_kind, target_id);

create trigger collections_touch_updated_at
  before update on public.collections
  for each row execute function public.touch_updated_at();
