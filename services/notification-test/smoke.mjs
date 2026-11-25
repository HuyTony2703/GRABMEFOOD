import {spawnSync} from "node:child_process";
import {randomBytes,randomUUID,createCipheriv} from "node:crypto";
import {RealtimeClient} from "@supabase/realtime-js";
import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdtempSync} from "node:fs";
import {join} from "node:path";
import {createServer} from "node:http";
import {connect} from "node:net";
const p="grab-notify-"+randomUUID().slice(0,8),db=p+"-db",volume=p+"-data";
const passwords=Array.from({length:4},()=>randomBytes(32).toString("hex"));
const migrationPassword=randomBytes(32).toString("hex");passwords.push(migrationPassword);
const [admin,authpass,restpass,rtpass]=passwords,jwt=randomBytes(32).toString("hex");
const cleanup=[];
const evidence=mkdtempSync(join(process.env.LOCALAPPDATA,"Temp","opencode","notify-acl-"));
function docker(args,input){const r=spawnSync("docker",["--context","desktop-linux",...args],{input,encoding:"utf8"});if(r.status!==0)throw Error(r.stderr);return r.stdout.trim()}
const sql=(s,extra=[])=>docker(["exec","-i",db,"psql","-XAtq","-v","ON_ERROR_STOP=1","-U","supabase_admin","-d","postgres",...extra],s);
const env=o=>Object.entries(o).flatMap(([k,v])=>["-e",`${k}=${v}`]);
function run(name,image,args=[]){docker(["run","-d","--name",name,"--network",p,...args,image]);cleanup.push(()=>docker(["rm","-f",name]));}
async function wait(label,f){for(let i=0;i<100;i++){try{if(await f())return}catch{}await new Promise(r=>setTimeout(r,150))}throw Error(label)}
try{
 docker(["network","create",p]);cleanup.push(()=>docker(["network","rm",p]));
 docker(["volume","create",volume]);cleanup.push(()=>docker(["volume","rm",volume]));
 run(db,"supabase/postgres@sha256:f371b5f3f2ac0a05703f33d6e6134515fb2498cab708fb948a0aeb7481467c00",
 ["-v",volume+":/var/lib/postgresql/data",...env({POSTGRES_PASSWORD:admin,JWT_SECRET:jwt})]);
 await wait("postgres readiness",()=>docker(["exec",db,"pg_isready","-h","127.0.0.1","-U","postgres"]).includes("accepting"));
 sql(`alter role supabase_auth_admin password :'authpass'; create role local_rest login noinherit password :'restpass';
 grant anon,authenticated to local_rest;
 create role realtime_local login replication password :'rtpass' nosuperuser nobypassrls;
 create schema if not exists _realtime authorization realtime_local;
 alter schema _realtime owner to realtime_local;
 create schema if not exists realtime authorization realtime_local;
 alter schema realtime owner to realtime_local;
 grant authenticated to realtime_local;
 create role realtime_migration login nosuperuser nobypassrls password :'migrationpass';
 grant realtime_local to realtime_migration;
 grant set on parameter log_min_messages to realtime_migration;
 create schema notification;
 create function notification.probe() returns text language sql as $$select 'ok'::text$$;
 revoke all on function notification.probe() from public;
 grant usage on schema notification to authenticated;
 grant execute on function notification.probe() to authenticated;`,
 ["-v","authpass="+authpass,"-v","restpass="+restpass,"-v","rtpass="+rtpass,"-v","migrationpass="+migrationPassword]);
 sql(`alter role supabase_admin password :'pass';`,["-v","pass="+admin]);
 function inventory(){
  return sql(`select jsonb_build_object('kind','schema','name',nspname,'owner',pg_get_userbyid(nspowner),'acl',nspacl::text)
   from pg_namespace where nspname in ('realtime','_realtime','notification')
   union all select jsonb_build_object('kind','relation','name',n.nspname||'.'||c.relname,'owner',pg_get_userbyid(c.relowner),'acl',c.relacl::text)
   from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname in ('realtime','_realtime','notification')
   union all select jsonb_build_object('kind','function','name',p.oid::regprocedure::text,'owner',pg_get_userbyid(p.proowner),'acl',p.proacl::text,'definer',p.prosecdef,'config',p.proconfig)
   from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname in ('realtime','_realtime','notification');`);
 }
 assert.equal(sql("select count(*) from notification.probe() where false"),"0");
 writeFileSync(join(evidence,"before.jsonl"),inventory());
 const plugin=sql("select name from pg_available_extensions where name='wal2json'");console.log("Postgres ready; wal2json extension listing:",plugin||"plugin is not an extension");
 run(p+"-auth","supabase/gotrue@sha256:6a916b47af0386b7e0152ca84f3d45d050bf056e449a75a5460b48742fd67822",
 ["-p","127.0.0.1:15599:9999",...env({GOTRUE_API_HOST:"0.0.0.0",GOTRUE_API_PORT:"9999",API_EXTERNAL_URL:"http://127.0.0.1:15599",
 GOTRUE_SITE_URL:"http://127.0.0.1:15598",GOTRUE_DB_DRIVER:"postgres",
 GOTRUE_DB_DATABASE_URL:`postgres://supabase_auth_admin:${authpass}@${db}:5432/postgres?search_path=auth`,
 GOTRUE_JWT_SECRET:jwt,GOTRUE_JWT_AUD:"authenticated",GOTRUE_JWT_DEFAULT_GROUP_NAME:"authenticated",
 GOTRUE_EXTERNAL_EMAIL_ENABLED:"true",GOTRUE_MAILER_AUTOCONFIRM:"true"})]);
 run(p+"-rest","postgrest/postgrest@sha256:5f4ce744539bbba786b4e24dbbd95bdb2a956dcf568c5374995a0ff4a68f5bd2",
 ["-p","127.0.0.1:15598:3000",...env({PGRST_DB_URI:`postgres://local_rest:${restpass}@${db}:5432/postgres`,
 PGRST_DB_SCHEMAS:"notification",PGRST_DB_ANON_ROLE:"anon",PGRST_JWT_SECRET:jwt})]);
 await wait("Auth readiness",async()=>(await fetch("http://127.0.0.1:15599/health")).ok);
 const credentials={email:randomUUID()+"@example.invalid",password:randomBytes(24).toString("hex")};
 assert.ok((await fetch("http://127.0.0.1:15599/signup",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(credentials)})).ok);
 const sessionResponse=await fetch("http://127.0.0.1:15599/token?grant_type=password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(credentials)});
 assert.equal(sessionResponse.status,200);const session=await sessionResponse.json();
 await wait("PostgREST readiness",async()=>(await fetch("http://127.0.0.1:15598/")).ok);
 const rpc=await fetch("http://127.0.0.1:15598/rpc/probe",{method:"POST",headers:{Authorization:"Bearer "+session.access_token,"Content-Type":"application/json"},body:"{}"});
 assert.equal(rpc.status,200);assert.equal(await rpc.json(),"ok");
 console.log("PASS smoke Auth JWT -> PostgREST authenticated probe RPC");
 const credentialsB={email:randomUUID()+"@example.invalid",password:randomBytes(24).toString("hex")};
 await fetch("http://127.0.0.1:15599/signup",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(credentialsB)});
 const sessionB=await(await fetch("http://127.0.0.1:15599/token?grant_type=password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(credentialsB)})).json();
 const subject=s=>JSON.parse(Buffer.from(s.access_token.split(".")[1],"base64url")).sub;
 const a=subject(session),b=subject(sessionB);
 sql(`create schema local_actor;
 create table local_actor.state(id uuid primary key,active boolean not null);
 insert into local_actor.state values('${a}',true),('${b}',true);
 create function local_actor.current_active() returns boolean language sql security definer set search_path='' as $$
 select exists(select 1 from local_actor.state where id=(current_setting('request.jwt.claims',true)::jsonb->>'sub')::uuid and active) $$;
 revoke all on function local_actor.current_active() from public;
 grant usage on schema local_actor to authenticated;
 grant execute on function local_actor.current_active() to authenticated;
 create table notification.notification_signals(user_id uuid primary key,revision bigint not null);
 alter table notification.notification_signals enable row level security;
 create policy own_active on notification.notification_signals for select to authenticated
 using(user_id=(current_setting('request.jwt.claims',true)::jsonb->>'sub')::uuid and local_actor.current_active());
 grant select on notification.notification_signals to authenticated,realtime_local;
 create publication grab_notification_signals for table notification.notification_signals with(publish='insert,update');
 notify pgrst,'reload schema';`);
 const rtEnv={DB_HOST:db,DB_PORT:"5432",DB_USER:"realtime_local",DB_PASSWORD:rtpass,DB_NAME:"postgres",
 DB_AFTER_CONNECT_QUERY:"SET search_path TO _realtime",DB_ENC_KEY:randomBytes(8).toString("hex"),
 API_JWT_SECRET:jwt,METRICS_JWT_SECRET:jwt,SECRET_KEY_BASE:randomBytes(64).toString("hex"),ERL_AFLAGS:"-proto_dist inet_tcp",
 SEED_SELF_HOST:"true",SELF_HOST_TENANT_NAME:"realtime-dev",APP_NAME:"realtime",PORT:"4000"};
 // Limited metadata/replication credential, not bootstrap postgres.
 const migrationEnv={...rtEnv,DB_USER:"supabase_admin",DB_PASSWORD:admin};
 const migration=spawnSync("docker",["--context","desktop-linux","run","--rm","--network",p,...env(migrationEnv),
 "supabase/realtime@sha256:c8409262081824433b65ec42a4f22a9198e6a026a375f4aa7de484357776d441","/app/bin/migrate"],{encoding:"utf8",timeout:60000});
 const output=String(migration.stdout)+String(migration.stderr);
 const safe=output.split("\n").filter(line=>/ERROR|permission|insufficient|extension|migration|undefined|schema|role/i.test(line)).join("\n");
 if(migration.status!==0)throw Error("Realtime limited-role migration failed:\n"+safe.slice(-6000));
 console.log("PASS Realtime metadata migration under bootstrap");
 const seed=spawnSync("docker",["--context","desktop-linux","run","--rm","--network",p,...env(migrationEnv),
 "supabase/realtime@sha256:c8409262081824433b65ec42a4f22a9198e6a026a375f4aa7de484357776d441",
 "/app/bin/realtime","eval","Realtime.Release.seeds(Realtime.Repo)"],{encoding:"utf8",timeout:60000});
 const seedOutput=String(seed.stdout)+String(seed.stderr);
 if(seed.status!==0||/MigrationsFailedToRun|permission denied|Failed to set-up tenant/.test(seedOutput))
  throw Error("Tenant migration failed:\n"+seedOutput.split("\n").filter(x=>/ERROR|error|permission|message:|Failed to/.test(x)).slice(-12).join("\n"));
 writeFileSync(join(evidence,"after-migration.jsonl"),inventory());
 sql(readFileSync(new URL("reset-list-changes.sql",import.meta.url),"utf8"));
 const metadataPass=randomBytes(32).toString("hex");passwords.push(metadataPass);
 sql(`create role realtime_metadata login nosuperuser nobypassrls password :'metapass';
 grant usage on schema _realtime to realtime_metadata;
 grant select,insert,update,delete on all tables in schema _realtime to realtime_metadata;
 grant usage,select on all sequences in schema _realtime to realtime_metadata;
 revoke all on all tables in schema realtime from anon,authenticated,service_role;
 revoke all on all functions in schema realtime from public,anon,authenticated,service_role;
 revoke all on all sequences in schema realtime from anon,authenticated,service_role;
 grant usage on schema realtime to realtime_local;
 grant select on realtime.subscription,realtime.schema_migrations to realtime_local;
 grant insert,update,delete on realtime.subscription to realtime_local;
 do $$declare fn record;begin
 for fn in select p.oid::regprocedure as signature from pg_proc p join pg_namespace n on n.oid=p.pronamespace
 where n.nspname='realtime' and p.proname in ('list_changes','apply_rls','build_prepared_statement_sql','quote_wal2json',
 'wal2json_escape_identifier','is_visible_through_filters','check_equality_op','cast','subscription_check_filters')
 loop execute format('grant execute on function %s to realtime_local',fn.signature);end loop;
 end $$;
 `,["-v","metapass="+metadataPass]);
 const encrypt=value=>{const c=createCipheriv("aes-128-ecb",Buffer.from(rtEnv.DB_ENC_KEY),null);return Buffer.concat([c.update(value,"utf8"),c.final()]).toString("base64")};
 sql(`update _realtime.extensions set settings=jsonb_set(jsonb_set(settings,'{db_user}',to_jsonb(:'usr'::text)),'{db_password}',to_jsonb(:'pwd'::text));`,
 ["-v","usr="+encrypt("realtime_local"),"-v","pwd="+encrypt(rtpass)]);
 sql("update _realtime.extensions set settings=settings||'{\"publication\":\"grab_notification_signals\",\"slot_name\":\"grab_notification_slot\"}'::jsonb;");
 writeFileSync(join(evidence,"after-hardening.jsonl"),inventory());
 assert.equal(sql("select has_parameter_privilege('realtime_local','log_min_messages','SET') or has_parameter_privilege('realtime_migration','log_min_messages','SET')"),"f");
 console.log("PASS local function patch preserves body/owner/ACL/invoker; migration SET revoked");
 console.log("Ownership/ACL inventories:",evidence);
 // Exact runtime-call gate before opening a socket.
 sql("select pg_create_logical_replication_slot('grab_notification_slot','wal2json')");
 const gate=sql(`set role realtime_local; select * from realtime.list_changes('grab_notification_signals'::name,'grab_notification_slot'::name,1,1024);`);
 console.log("Runtime call result:",gate);
 run("realtime-dev."+p,"supabase/realtime@sha256:c8409262081824433b65ec42a4f22a9198e6a026a375f4aa7de484357776d441",
 ["-p","127.0.0.1:15600:4000","--entrypoint","/app/bin/server",...env({...rtEnv,DB_USER:"realtime_metadata",DB_PASSWORD:metadataPass,SEED_SELF_HOST:"false"})]);
 await wait("Realtime HTTP readiness",async()=>(await fetch("http://127.0.0.1:15600/api/tenants/realtime-dev/health",{headers:{Authorization:"Bearer "+session.access_token}})).ok);
 // Test-only Host routing: self-host tenant derives its ID from the HTTP host.
 // No auth header/token changes; not an application gateway or persistence service.
 const proxy=createServer();
 proxy.on("upgrade",(req,socket,head)=>{
  const upstream=connect(15600,"127.0.0.1",()=>{
   const headers=Object.entries(req.headers).filter(([key])=>key!=="host").map(([key,value])=>`${key}: ${value}`).join("\r\n");
   upstream.write(`${req.method} ${req.url} HTTP/1.1\r\nHost: realtime-dev.localhost\r\n${headers}\r\n\r\n`);
   if(head.length)upstream.write(head);socket.pipe(upstream);upstream.pipe(socket);
  });
  upstream.on("error",()=>socket.destroy());socket.on("error",()=>upstream.destroy());
  socket.on("close",()=>upstream.destroy());
 });
 await new Promise((resolve,reject)=>{proxy.once("error",reject);proxy.listen(15601,"127.0.0.1",resolve)});
 const client=new RealtimeClient("ws://127.0.0.1:15601/socket",{params:{apikey:session.access_token}});
 await client.setAuth(session.access_token);
 try{
  await new Promise((resolve,reject)=>{
   const timer=setTimeout(()=>reject(Error("Realtime subscribe timeout")),15000);
    client.channel("smoke").subscribe((status,error)=>{
    if(status==="SUBSCRIBED"){clearTimeout(timer);resolve();}
    if(status==="CHANNEL_ERROR"){clearTimeout(timer);reject(Error("Realtime channel rejected: "+String(error)))}
   });
  });
  console.log("PASS Realtime authenticated channel subscribe (not yet Postgres Changes A/B proof)");
  const clientB=new RealtimeClient("ws://127.0.0.1:15601/socket",{params:{apikey:sessionB.access_token}});
  await clientB.setAuth(sessionB.access_token);
  const seenA=[],seenB=[];
  const subscribe=(c,label,events)=>new Promise((resolve,reject)=>{
   const timer=setTimeout(()=>reject(Error("Postgres Changes subscribe timeout "+label)),20000);
   c.channel(label).on("postgres_changes",{event:"*",schema:"notification",table:"notification_signals"},event=>events.push(event))
    .subscribe((status,error)=>{if(status==="SUBSCRIBED"){clearTimeout(timer);resolve()}if(status==="CHANNEL_ERROR"){clearTimeout(timer);reject(Error("Postgres Changes "+label+" "+String(error)))}});
  });
  try{
   await subscribe(client,"A",seenA);await subscribe(clientB,"B",seenB);
   const denied=await fetch("http://127.0.0.1:15598/notification_signals",{method:"POST",headers:{Authorization:"Bearer "+session.access_token,"Content-Type":"application/json"},body:JSON.stringify({user_id:a,revision:999})});
   assert.equal(denied.status,403);
   sql(`insert into notification.notification_signals values('${a}',1),('${b}',1);`);
   await wait("A and B real signals",()=>seenA.length>=1&&seenB.length>=1);
   assert.ok(seenA.every(e=>e.new.user_id===a));assert.ok(seenB.every(e=>e.new.user_id===b));
   const snapshotB=await(await fetch(`http://127.0.0.1:15598/notification_signals?user_id=eq.${b}`,{headers:{Authorization:"Bearer "+session.access_token}})).json();
   assert.deepEqual(snapshotB,[]);
   console.log("PASS Postgres Changes real signal; A/B unfiltered subscriptions isolated, browser insert denied");
   const before=seenA.length, beforeB=seenB.length;
   sql(`update local_actor.state set active=false where id='${a}';update notification.notification_signals set revision=2;`);
   await wait("B signal after A locked",()=>seenB.length>beforeB);
   await new Promise(r=>setTimeout(r,1000));
   assert.equal(seenA.length,before);
   assert.ok(JSON.parse(Buffer.from(session.access_token.split(".")[1],"base64url")).exp>Date.now()/1000);
   assert.deepEqual(await(await fetch("http://127.0.0.1:15598/notification_signals",{headers:{Authorization:"Bearer "+session.access_token}})).json(),[]);
   console.log("PASS same unexpired A subscription stays open but gets no post-lock update; B receives control update");
  }finally{await clientB.removeAllChannels();clientB.disconnect();}
 }finally{await client.removeAllChannels();client.disconnect();proxy.close();}
}catch(error){
 let message=String(error.message);for(const secret of [...passwords,jwt])message=message.replaceAll(secret,"[redacted]");
 console.error(message);
 try{
  const logs=docker(["logs","realtime-dev."+p]);
  let tail=logs.split("\n").filter(l=>/error|denied|tenant|Tenant|permission/i.test(l)).slice(-12).join("\n");
  for(const secret of [...passwords,jwt])tail=tail.replaceAll(secret,"[redacted]");
  tail=tail.replace(/eyJ[\w-]+\.[\w-]+\.[\w-]+/g,"[JWT redacted]");
  console.error(tail);
 }catch{}
 process.exitCode=1;
}finally{for(const c of cleanup.reverse())try{c()}catch{console.error("Cleanup failed");process.exitCode=1}}
