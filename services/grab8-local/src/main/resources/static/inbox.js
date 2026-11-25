const $ = id => document.getElementById(id);
const en=new URLSearchParams(location.search).get("lang")==="en";
const t=(vi,english)=>en?english:vi;
const home="/inbox.html"+(en?"?lang=en":"");
const unavailable=t("Nội dung này không còn khả dụng","This content is no longer available");
document.documentElement.lang=en?"en":"vi";
if(en){
 document.title="Local notifications";document.querySelector("h1").textContent="Notification inbox";
 document.querySelector("#login button").textContent="Sign in";$("retry").textContent="Try again";
 for(const [i,text] of ["Test email ","Test password "].entries())document.querySelectorAll("#login label")[i].firstChild.textContent=text;
}
const gone = new Set();
let token, revision = 0;
async function render() {
  const run = ++revision;
  const id = new URLSearchParams(location.search).get("thread");
  $("retry").hidden = true;
  $("status").textContent = "";
  $("inbox").replaceChildren();
  $("thread").replaceChildren();
  $("thread").hidden = true;
  if (!token) return;
  try {
    if (id) {
      const r = await fetch(`/local/thread/${encodeURIComponent(id)}`);
      if (run !== revision) return;
      if (r.status === 404) {
        gone.add(id);
        history.replaceState(null, "", home);
        await render();
        if (!new URLSearchParams(location.search).has("thread"))
          $("status").textContent = unavailable;
        return;
      }
      if (!r.ok) throw Error();
      const thread = await r.json();
      if (run !== revision) return;
      const h = document.createElement("h2"); h.textContent = t("Bình luận","Comment");
      const root = document.createElement("p"); root.textContent = thread.root;
      const list = document.createElement("ul");
      for (const reply of thread.replies) { const li = document.createElement("li"); li.textContent = reply; list.append(li); }
      const back = document.createElement("a"); back.href = home; back.textContent = t("Về hộp thông báo","Back to inbox");
      $("thread").append(h, root, list, back); $("thread").hidden = false;
      return;
    }
    const r = await fetch("/inbox", {headers:{Authorization:`Bearer ${token}`},cache:"no-store"});
    if (!r.ok) throw Error();
    const rows = await r.json();
    if (run !== revision) return;
    for (const row of rows) {
      const li = document.createElement("li");
      if (gone.has(row.threadId)) li.textContent = unavailable;
      else {
        const link = document.createElement("a");
        link.href = `/inbox.html?thread=${encodeURIComponent(row.threadId)}`+(en?"&lang=en":"");
        link.textContent = t("Có người trả lời bình luận của bạn","Someone replied to your comment");
        li.append(link);
      }
      $("inbox").append(li);
    }
    if (!rows.length) $("status").textContent = t("Không có thông báo","No notifications");
  } catch {
    if (run !== revision) return;
    $("status").textContent = t("Tạm thời không tải được nội dung.","Content could not be loaded temporarily.");
    $("retry").hidden = false;
    $("retry").focus();
  }
}
const key = "grab8-local-session";
token = sessionStorage.getItem(key);
$("retry").onclick = render;
$("login").onsubmit = async e => {
  e.preventDefault();
  ++revision; token = null; sessionStorage.removeItem(key);
  $("inbox").replaceChildren(); $("thread").hidden = true;
  try {
    const r = await fetch("/local/session",{method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify(Object.fromEntries(new FormData(e.target)))});
    if (!r.ok) throw Error();
    token=(await r.json()).access_token; sessionStorage.setItem(key,token);
    e.target.reset(); history.replaceState(null,"",home); await render();
  } catch { $("status").textContent = t("Không đăng nhập được tài khoản test.","Unable to sign in to the test account."); }
};
await render();
