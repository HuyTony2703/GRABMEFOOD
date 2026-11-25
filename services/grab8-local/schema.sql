create role community_runtime nologin nobypassrls;
create role notification_runtime nologin nobypassrls;
grant community_runtime,notification_runtime to rest_login;
create role community_owner nologin nobypassrls;
create role notification_owner nologin nobypassrls;
create schema community authorization community_owner;
create schema notification authorization notification_owner;
set role community_owner;
alter default privileges revoke execute on functions from public;
create table community.comments(id uuid primary key, actor uuid not null, target text not null, parent uuid references community.comments, body text not null);
create table community.outbox(id uuid primary key, payload jsonb not null, ack boolean not null default false);
create function community.create_comment(actor uuid,target text,parent uuid,body text) returns uuid
language plpgsql security definer set search_path='' as $$
declare cid uuid:=gen_random_uuid(); old community.comments%rowtype;
begin
 if $3 is not null then
   select * into old from community.comments c where c.id=$3 and c.parent is null and c.target=$2;
   if not found then raise sqlstate 'PT404'; end if;
 end if;
 insert into community.comments values(cid,$1,$2,$3,$4);
 if $3 is not null and old.actor<>$1 then
   insert into community.outbox(id,payload) values(cid,jsonb_build_object('eventId',cid,'recipient',old.actor,'threadId',old.id));
 end if;
 return cid;
end $$;
create function community.thread(tid uuid) returns jsonb language sql security definer set search_path='' as $$
 select jsonb_build_object('target',r.target,'root',r.body,'replies',
   (select coalesce(jsonb_agg(c.body),'[]') from community.comments c where c.parent=r.id))
 from community.comments r where r.id=tid and r.parent is null
$$;
create function community.pending() returns jsonb language sql security definer set search_path='' as $$
 select coalesce(jsonb_agg(payload),'[]') from community.outbox where not ack
$$;
create function community.ack(eid uuid) returns void language sql security definer set search_path='' as $$
 update community.outbox set ack=true where id=eid
$$;
reset role;
set role notification_owner;
alter default privileges revoke execute on functions from public;
create table notification.receipts(producer text not null,eid uuid not null,digest text not null,primary key(producer,eid));
create table notification.inbox(producer text not null,eid uuid not null,recipient uuid not null,thread uuid not null,
 primary key(producer,eid),foreign key(producer,eid) references notification.receipts);
create function notification.ingest(eid uuid,digest text,recipient uuid,thread uuid) returns void
language plpgsql security definer set search_path='' as $$
begin
 insert into notification.receipts values('community',$1,$2) on conflict do nothing;
 if not exists(select 1 from notification.receipts r where r.producer='community' and r.eid=$1 and r.digest=$2) then
   raise sqlstate 'PT409';
 end if;
 insert into notification.inbox values('community',$1,$3,$4) on conflict do nothing;
end $$;
create function notification.inbox_for(actor uuid) returns jsonb language sql security definer set search_path='' as $$
 select coalesce(jsonb_agg(jsonb_build_object('eventId',eid,'threadId',thread) order by eid),'[]')
 from notification.inbox where recipient=actor
$$;
reset role;
grant usage on schema community to community_runtime;
grant usage on schema notification to notification_runtime;
grant execute on function community.create_comment(uuid,text,uuid,text), community.thread(uuid),
 community.pending(), community.ack(uuid) to community_runtime;
grant execute on function notification.ingest(uuid,text,uuid,uuid), notification.inbox_for(uuid) to notification_runtime;
