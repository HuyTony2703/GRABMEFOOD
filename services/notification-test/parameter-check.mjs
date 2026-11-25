// Isolated PostgreSQL function-SET semantics, not a Realtime delivery test.
import {spawnSync} from "node:child_process";
import {randomBytes,randomUUID} from "node:crypto";
import assert from "node:assert/strict";
const name="grab-parameter-"+randomUUID().slice(0,8),volume=name+"-data";
const password=randomBytes(32).toString("hex");
function docker(args,input){
 const r=spawnSync("docker",["--context","desktop-linux",...args],{input,encoding:"utf8"});
 if(r.status!==0)throw Error(r.stderr.replaceAll(password,"[redacted]"));return r.stdout.trim();
}
function sql(text){return spawnSync("docker",["--context","desktop-linux","exec","-i",name,"psql","-XAtq","-v","ON_ERROR_STOP=1","-U","supabase_admin","-d","postgres"],{input:text,encoding:"utf8"});}
let created=false;
try{
 docker(["volume","create",volume]);
 docker(["run","-d","--name",name,"-v",volume+":/var/lib/postgresql/data","-e","POSTGRES_PASSWORD="+password,
 "supabase/postgres@sha256:f371b5f3f2ac0a05703f33d6e6134515fb2498cab708fb948a0aeb7481467c00"]);created=true;
 let ready=false;
 for(let i=0;i<100;i++){if(sql("select 1").status===0){ready=true;break}await new Promise(r=>setTimeout(r,150));}
 assert.ok(ready);
 const setup=sql(`create role migration_probe nologin nosuperuser nobypassrls;
 create role runtime_probe nologin nosuperuser nobypassrls;
 create schema probe authorization migration_probe;
 grant usage on schema probe to runtime_probe;
 grant set on parameter log_min_messages to migration_probe;
 set role migration_probe;
 create function probe.function_set() returns text language sql set log_min_messages to 'fatal'
 as $$select current_setting('log_min_messages')$$;
 revoke all on function probe.function_set() from public;
 grant execute on function probe.function_set() to runtime_probe;
 reset role;
 revoke set on parameter log_min_messages from migration_probe;
 select prosecdef,proconfig from pg_proc where oid='probe.function_set()'::regprocedure;
 select has_parameter_privilege('migration_probe','log_min_messages','SET'),
 has_parameter_privilege('runtime_probe','log_min_messages','SET');`);
 assert.equal(setup.status,0,setup.stderr);
 console.log("Function metadata / SET grants after revoke:\n"+setup.stdout.trim());
 const invoke=sql("set role runtime_probe; select probe.function_set();");
 assert.notEqual(invoke.status,0);
 assert.match(invoke.stderr,/permission denied to set parameter "log_min_messages"/);
 console.log("PASS runtime EXECUTE without SET is denied: "+invoke.stderr.trim());
}finally{
 if(created)docker(["rm","-f",name]);
 docker(["volume","rm",volume]);
}
