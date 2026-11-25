-- Bootstrap only, after tenant migrations, on the new local test volume.
begin;
create temporary table before_patch as
select prosrc,prosecdef,proowner,proacl
from pg_proc where oid='realtime.list_changes(name,name,integer,integer)'::regprocedure;
alter function realtime.list_changes(name,name,integer,integer) reset log_min_messages;
do $$
begin
 if exists(select 1 from before_patch b join pg_proc p
 on p.oid='realtime.list_changes(name,name,integer,integer)'::regprocedure
 where (b.prosrc,b.prosecdef,b.proowner,b.proacl) is distinct from (p.prosrc,p.prosecdef,p.proowner,p.proacl))
 then raise exception 'function semantics or privilege changed'; end if;
 if exists(select 1 from pg_proc p where p.oid='realtime.list_changes(name,name,integer,integer)'::regprocedure
 and (p.prosecdef or exists(select 1 from unnest(p.proconfig) c where c like 'log_min_messages=%')))
 then raise exception 'patch verification failed'; end if;
end $$;
revoke set on parameter log_min_messages from realtime_migration;
commit;
