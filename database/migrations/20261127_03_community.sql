-- GrabMeFood GRAB-5 — community domain (comments and one-level replies).
-- DRAFT: not applied to Supabase Cloud until the owner approves the gate in
-- docs/DATABASE.md.
-- Body limit 2000 is a provisional engineering value; BR-COM-05 is still open.

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users (id) on delete cascade,
  target_kind text not null check (target_kind in ('restaurant', 'dish')),
  target_id uuid not null,
  parent_id uuid references public.comments (id) on delete cascade,
  body text not null check (length(btrim(body)) between 1 and 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index comments_target_idx
  on public.comments (target_kind, target_id, created_at);
create index comments_parent_idx on public.comments (parent_id);

create trigger comments_touch_updated_at
  before update on public.comments
  for each row execute function public.touch_updated_at();

-- A reply must point at a top-level comment on the same target; replies to
-- replies are rejected (BR-COM-03).
create function public.enforce_comment_reply_depth()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  parent_parent uuid;
  parent_kind text;
  parent_target uuid;
begin
  if new.parent_id is null then
    return new;
  end if;

  select c.parent_id, c.target_kind, c.target_id
    into parent_parent, parent_kind, parent_target
    from public.comments c
   where c.id = new.parent_id;

  if not found then
    raise exception 'COMMENT_PARENT_NOT_FOUND' using errcode = '23503';
  end if;
  if parent_parent is not null then
    raise exception 'COMMENT_REPLY_DEPTH' using errcode = '23514';
  end if;
  if parent_kind <> new.target_kind or parent_target <> new.target_id then
    raise exception 'COMMENT_TARGET_MISMATCH' using errcode = '23514';
  end if;

  return new;
end;
$$;

revoke all on function public.enforce_comment_reply_depth()
  from public, anon, authenticated;

create trigger comments_reply_depth
  before insert or update on public.comments
  for each row execute function public.enforce_comment_reply_depth();

-- Deleting a restaurant or dish removes its comments, including replies owned
-- by other users through the parent_id cascade (BR-LIFE-03/04, BR-ACC-05/06).
create function public.delete_content_comments()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  delete from public.comments
   where target_kind = tg_argv[0]
     and target_id = old.id;
  return old;
end;
$$;

revoke all on function public.delete_content_comments()
  from public, anon, authenticated;

create trigger dishes_delete_comments
  after delete on public.dishes
  for each row execute function public.delete_content_comments('dish');

create trigger restaurants_delete_comments
  after delete on public.restaurants
  for each row execute function public.delete_content_comments('restaurant');
