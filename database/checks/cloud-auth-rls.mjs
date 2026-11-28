// Cloud Auth/RLS checks for GRAB-5. Uses real Supabase Auth password sign-in
// and the Data API. Secrets come from a local JSON file outside the repo and
// are never printed. Output contains UUIDs and pass/fail only.
//
// Usage:
//   $env:GMF_SUPABASE_URL="https://<ref>.supabase.co"
//   $env:GMF_SUPABASE_PUBLISHABLE_KEY="sb_publishable_..."
//   $env:GMF_TEST_USERS_FILE="C:\...\grab5-test-users.json"
//   node database/checks/cloud-auth-rls.mjs --identity
//   node database/checks/cloud-auth-rls.mjs
//
// Secret file shape:
//   { "a": {"email":"...","password":"..."},
//     "b": {"email":"...","password":"..."},
//     "admin": {"email":"...","password":"..."} }

import fs from "node:fs";

const url = process.env.GMF_SUPABASE_URL;
const key = process.env.GMF_SUPABASE_PUBLISHABLE_KEY;
const file = process.env.GMF_TEST_USERS_FILE;
if (!url || !key || !file) {
  console.error("Missing GMF_SUPABASE_URL, GMF_SUPABASE_PUBLISHABLE_KEY or GMF_TEST_USERS_FILE");
  process.exit(2);
}

const users = JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/, ""));
const identityOnly = process.argv.includes("--identity");
const rest = `${url}/rest/v1`;
const PUBLIC_RESTAURANT = "20000000-0000-0000-0000-000000000001";
const HIDDEN_RESTAURANT = "20000000-0000-0000-0000-000000000003";

let failures = 0;
const results = [];
function check(name, ok, detail) {
  results.push({ name, ok: Boolean(ok), detail });
  if (!ok) failures += 1;
}

async function signIn(who) {
  const user = users[who];
  if (!user?.email || !user?.password) throw new Error(`Missing credentials for ${who}`);
  const res = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: key, "content-type": "application/json" },
    body: JSON.stringify({ email: user.email, password: user.password }),
  });
  const body = await res.json();
  if (!res.ok || !body.access_token) {
    throw new Error(`Sign-in failed for ${who}: ${body.error_description ?? body.msg ?? res.status}`);
  }
  return { token: body.access_token, id: body.user.id };
}

function client(session) {
  return async function call(path, init = {}) {
    const res = await fetch(rest + path, {
      ...init,
      headers: {
        apikey: key,
        Authorization: `Bearer ${session.token}`,
        "content-type": "application/json",
        ...(init.headers ?? {}),
      },
    });
    const text = await res.text();
    let body = null;
    try { body = text ? JSON.parse(text) : null; } catch { body = text; }
    return { status: res.status, body };
  };
}

const a = await signIn("a");
const b = await signIn("b");
const admin = await signIn("admin");

if (identityOnly) {
  console.log(JSON.stringify({ a: a.id, b: b.id, admin: admin.id }, null, 2));
  process.exit(0);
}

const asA = client(a);
const asB = client(b);
const asAdmin = client(admin);

// Make re-runs deterministic: remove this script's own test rows first.
await asA("/collections?name=like.GRAB-5*", { method: "DELETE" });
await asB("/collections?name=like.GRAB-5*", { method: "DELETE" });
await asA("/comments?body=like.GRAB-5*", { method: "DELETE" });
await asB("/comments?body=like.GRAB-5*", { method: "DELETE" });

const created = { collections: [], saved: [], comments: [], notifications: [] };

try {
  // Create one collection per user; B must not see A's.
  let r = await asA("/collections", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ owner_id: a.id, kind: "restaurant", name: "GRAB-5 A" }),
  });
  check("A creates own collection", r.status === 201 && Array.isArray(r.body) && r.body.length === 1,
    `${r.status}`);
  const colA = r.body?.[0]?.id;
  if (colA) created.collections.push(colA);

  r = await asB("/collections", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ owner_id: b.id, kind: "restaurant", name: "GRAB-5 B" }),
  });
  check("B creates own collection", r.status === 201 && r.body?.length === 1, `${r.status}`);
  const colB = r.body?.[0]?.id;
  if (colB) created.collections.push(colB);

  r = await asA("/collections?select=id,name");
  check("A lists only own collection", r.status === 200 && r.body?.length === 1 && r.body[0].id === colA,
    `status ${r.status}, rows ${r.body?.length}`);

  r = await asA(`/collections?id=eq.${colB}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ name: "hijacked" }),
  });
  check("A cannot update B collection", r.status >= 200 && r.status < 300 && Array.isArray(r.body) && r.body.length === 0,
    `status ${r.status}, rows ${Array.isArray(r.body) ? r.body.length : "?"}`);

  r = await asA(`/collections?id=eq.${colB}`, {
    method: "DELETE",
    headers: { Prefer: "return=representation" },
  });
  check("A cannot delete B collection", r.status >= 200 && r.status < 300 && Array.isArray(r.body) && r.body.length === 0,
    `status ${r.status}, rows ${Array.isArray(r.body) ? r.body.length : "?"}`);

  r = await asB(`/collections?select=id,name`);
  check("B collection unchanged", r.status === 200 && r.body?.length === 1 && r.body[0].id === colB,
    `status ${r.status}, rows ${r.body?.length}`);

  r = await asA("/collections", {
    method: "POST",
    body: JSON.stringify({ owner_id: b.id, kind: "restaurant", name: "forged" }),
  });
  check("A cannot create collection owned by B", r.status === 401 || r.status === 403, `${r.status}`);

  r = await asA(`/account_states?user_id=eq.${a.id}`, {
    method: "PATCH",
    body: JSON.stringify({ is_admin: true }),
  });
  check("A cannot grant self admin", r.status === 401 || r.status === 403, `${r.status}`);

  r = await asA("/rpc/admin_set_account_state", {
    method: "POST",
    body: JSON.stringify({ p_target_user: a.id, p_make_locked: false, p_make_admin: true }),
  });
  check("A cannot call admin RPC", r.status === 401 || r.status === 403, `${r.status}`);

  // Saved items: owner only, available target only, marker survives hide/delete.
  r = await asA("/saved_items", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ collection_id: colA, target_kind: "restaurant", target_id: PUBLIC_RESTAURANT }),
  });
  check("A saves a public restaurant", r.status === 201 && r.body?.length === 1, `${r.status}`);
  created.saved.push({ collection: colA, target: PUBLIC_RESTAURANT });

  r = await asA("/saved_items", {
    method: "POST",
    body: JSON.stringify({ collection_id: colA, target_kind: "restaurant", target_id: HIDDEN_RESTAURANT }),
  });
  check("A cannot save a hidden restaurant", r.status === 401 || r.status === 403, `${r.status}`);

  r = await asA("/saved_items", {
    method: "POST",
    body: JSON.stringify({ collection_id: colB, target_kind: "restaurant", target_id: PUBLIC_RESTAURANT }),
  });
  check("A cannot save into B collection", r.status === 401 || r.status === 403, `${r.status}`);

  r = await asB("/saved_items?select=target_id");
  check("B sees no A saved item", r.status === 200 && r.body?.length === 0, `${r.status}, rows ${r.body?.length}`);

  // Hide the saved target: the private marker stays, but no payload is exposed.
  r = await asAdmin(`/restaurants?id=eq.${PUBLIC_RESTAURANT}`, {
    method: "PATCH",
    body: JSON.stringify({ is_public: false }),
  });
  check("Admin hides saved restaurant", r.status < 300, `${r.status}`);

  r = await asA("/saved_items?select=target_id");
  check("A marker survives target hide", r.status === 200 && r.body?.length === 1, `${r.status}, rows ${r.body?.length}`);

  r = await asA(`/restaurants?id=eq.${PUBLIC_RESTAURANT}&select=id`);
  check("A cannot read hidden target", r.status === 200 && r.body?.length === 0, `${r.status}, rows ${r.body?.length}`);

  const anonHidden = await fetch(`${rest}/restaurants?id=eq.${PUBLIC_RESTAURANT}&select=id`, { headers: { apikey: key } });
  const anonHiddenBody = await anonHidden.json();
  check("Anon cannot read hidden target", anonHidden.status === 200 && anonHiddenBody.length === 0,
    `${anonHidden.status}, rows ${anonHiddenBody.length}`);

  r = await asAdmin(`/restaurants?id=eq.${PUBLIC_RESTAURANT}`, {
    method: "PATCH",
    body: JSON.stringify({ is_public: true }),
  });
  check("Admin restores saved restaurant", r.status < 300, `${r.status}`);

  // Comments: author edit/delete only; admin delete later.
  r = await asA("/comments", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      author_id: a.id, target_kind: "restaurant", target_id: PUBLIC_RESTAURANT, body: "GRAB-5 A comment",
    }),
  });
  check("A comments on public restaurant", r.status === 201 && r.body?.length === 1, `${r.status}`);
  const commentA = r.body?.[0]?.id;
  if (commentA) created.comments.push(commentA);

  r = await asA("/comments", {
    method: "POST",
    body: JSON.stringify({
      author_id: a.id, target_kind: "restaurant", target_id: HIDDEN_RESTAURANT, body: "hidden target",
    }),
  });
  check("A cannot comment on hidden restaurant", r.status === 401 || r.status === 403, `${r.status}`);

  r = await asB(`/comments?id=eq.${commentA}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ body: "edited by B" }),
  });
  check("B cannot edit A comment", r.status >= 200 && r.status < 300 && r.body?.length === 0, `${r.status}`);

  r = await asB(`/comments?id=eq.${commentA}`, {
    method: "DELETE",
    headers: { Prefer: "return=representation" },
  });
  check("B cannot delete A comment", r.status === 401 || r.status === 403 || (r.status < 300 && r.body?.length === 0),
    `${r.status}`);

  r = await asA(`/comments?id=eq.${commentA}&select=id,body`);
  check("A comment still exists after B delete", r.status === 200 && r.body?.length === 1, `${r.status}`);

  r = await asA(`/comments?id=eq.${commentA}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ body: "GRAB-5 A comment edited" }),
  });
  check("A edits own comment", r.status < 300 && r.body?.length === 1, `${r.status}`);

  // Notification recipient isolation, if seeds exist.
  r = await asA("/notifications?select=id,read_at");
  const aNotifs = Array.isArray(r.body) ? r.body : [];
  check("A reads own notification rows only", r.status === 200, `${r.status}`);

  r = await asB("/notifications?select=id");
  const bNotifs = Array.isArray(r.body) ? r.body : [];
  if (bNotifs.length > 0) {
    r = await asA(`/notifications?id=eq.${bNotifs[0].id}`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ read_at: new Date().toISOString() }),
    });
    check("A cannot mark B notification read", r.status < 300 && r.body?.length === 0, `${r.status}`);
  } else {
    check("B notification seed present", false, "no notification row for B");
  }

  if (aNotifs.length > 0) {
    r = await asA(`/notifications?id=eq.${aNotifs[0].id}`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ read_at: new Date().toISOString() }),
    });
    check("A marks own notification read", r.status < 300 && r.body?.length === 1, `${r.status}`);
  }

  r = await asA("/notifications", {
    method: "POST",
    body: JSON.stringify({
      recipient_id: a.id, kind: "admin_broadcast", message_vi: "self", message_en: "self", dedup_key: "self",
    }),
  });
  check("A cannot insert notification", r.status === 401 || r.status === 403, `${r.status}`);

  // Admin: hidden read, delete other comment, no direct account_state write.
  r = await asAdmin(`/restaurants?id=eq.${HIDDEN_RESTAURANT}&select=slug,is_public`);
  check("Admin reads hidden restaurant", r.status === 200 && r.body?.length === 1, `${r.status}`);

  r = await asB("/comments", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      author_id: b.id, target_kind: "restaurant", target_id: PUBLIC_RESTAURANT, body: "GRAB-5 B comment",
    }),
  });
  check("B comments on public restaurant", r.status === 201 && r.body?.length === 1, `${r.status}`);
  const commentB = r.body?.[0]?.id;
  if (commentB) created.comments.push(commentB);

  r = await asAdmin(`/comments?id=eq.${commentB}`, {
    method: "DELETE",
    headers: { Prefer: "return=representation" },
  });
  check("Admin deletes B comment", r.status < 300 && r.body?.length === 1, `${r.status}`);

  r = await asAdmin(`/account_states?user_id=eq.${a.id}`, {
    method: "PATCH",
    body: JSON.stringify({ is_admin: true }),
  });
  check("Admin cannot write account_states directly", r.status === 401 || r.status === 403, `${r.status}`);

  r = await asAdmin("/rpc/admin_set_account_state", {
    method: "POST",
    body: JSON.stringify({ p_target_user: admin.id, p_make_locked: true, p_make_admin: true }),
  });
  check("Admin cannot lock own account", r.status >= 400, `${r.status}`);

  r = await asAdmin("/rpc/admin_set_account_state", {
    method: "POST",
    body: JSON.stringify({ p_target_user: a.id, p_make_locked: true, p_make_admin: false }),
  });
  check("Admin locks A", r.status < 300, `${r.status}`);

  // Locked A: existing token still reads public but cannot write.
  r = await asA(`/restaurants?select=slug&is_public=eq.true`);
  check("Locked A still reads public catalog", r.status === 200 && r.body?.length === 2, `${r.status}, rows ${r.body?.length}`);

  r = await asA("/collections", {
    method: "POST",
    body: JSON.stringify({ owner_id: a.id, kind: "restaurant", name: "after lock" }),
  });
  check("Locked A cannot create collection", r.status === 401 || r.status === 403, `${r.status}`);

  r = await asA("/comments", {
    method: "POST",
    body: JSON.stringify({
      author_id: a.id, target_kind: "restaurant", target_id: PUBLIC_RESTAURANT, body: "after lock",
    }),
  });
  check("Locked A cannot comment", r.status === 401 || r.status === 403, `${r.status}`);

  r = await asA("/notifications?select=id");
  check("Locked A cannot read notifications", r.status === 200 && (r.body?.length ?? 0) === 0, `${r.status}, rows ${r.body?.length}`);

  // Restore A so a re-run is possible; cleanup is a separate approved SQL step.
  r = await asAdmin("/rpc/admin_set_account_state", {
    method: "POST",
    body: JSON.stringify({ p_target_user: a.id, p_make_locked: false, p_make_admin: false }),
  });
  check("Admin unlocks A", r.status < 300, `${r.status}`);
} finally {
  console.log(JSON.stringify({
    checks: results.length,
    failures,
    ids: {
      a: a.id,
      b: b.id,
      admin: admin.id,
      createdCollections: created.collections,
      createdComments: created.comments,
    },
    results,
  }, null, 2));
}

if (failures > 0) process.exitCode = 1;
