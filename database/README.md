# Database migrations

Nguồn SQL duy nhất cho schema sản phẩm mới. **Chưa migration nào trong thư mục
này được áp lên Supabase Cloud.** Gate duyệt nằm ở
[`docs/DATABASE.md`](../docs/DATABASE.md).

## Cấu trúc

| Thư mục | Nội dung |
| --- | --- |
| `migrations/` | Migration sẽ chạy theo thứ tự tên file, mỗi file một miền/quyền |
| `replay/` | Harness **local only**: stub role/auth giả lập, kiểm DDL/grants/policy/trigger |

`replay/00_local_stub.sql` tạo role `anon`/`authenticated`/`service_role`,
schema `auth`, bảng `auth.users` và `auth.uid()` đọc
`request.jwt.claim.sub`. Đây không phải Supabase và không được chạy trên
Cloud.

## Replay local

Cần Docker. Từ thư mục repo (PowerShell):

```powershell
docker run --rm -d --name gmf-sqlcheck `
  -e POSTGRES_PASSWORD=localonly -e POSTGRES_DB=gmfcheck `
  -v "${PWD}\database:/db:ro" postgres:17-alpine

$files = @(
  '/db/replay/00_local_stub.sql',
  '/db/migrations/20261127_01_catalog.sql',
  '/db/migrations/20261127_02_collections.sql',
  '/db/migrations/20261127_03_community.sql',
  '/db/migrations/20261127_04_accounts.sql',
  '/db/migrations/20261127_05_notifications.sql',
  '/db/migrations/20261127_06_security.sql',
  '/db/replay/10_checks.sql',
  '/db/replay/20_rls_checks.sql'
)
foreach ($f in $files) {
  docker exec gmf-sqlcheck psql -U postgres -d gmfcheck -v ON_ERROR_STOP=1 -q -f $f
  if ($LASTEXITCODE -ne 0) { throw "Failed: $f" }
}
docker rm -f gmf-sqlcheck
```

Kết quả mong đợi: hai dòng `local replay checks passed` và
`local rls checks passed`. Nếu một file lỗi, `ON_ERROR_STOP` dừng ngay.

## Kiểm Cloud bằng Auth thật

Sau khi owner tạo test user (Auto Confirm) và đặt secret ngoài repo:

```powershell
$env:GMF_SUPABASE_URL = "https://<ref>.supabase.co"
$env:GMF_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_..."
$env:GMF_TEST_USERS_FILE = "C:\path\outside\repo\grab5-test-users.json"
node database/checks/cloud-auth-rls.mjs --identity   # in UUID để seed admin/notification
node database/checks/cloud-auth-rls.mjs              # 39 check A/B/locked/admin
```

Script không in token/mật khẩu. Kết quả GRAB-5 ngày 2026-11-27:
[`docs/evidence/grab5-cloud-migration-2026-11-27`](../docs/evidence/grab5-cloud-migration-2026-11-27/README.md).

## Giới hạn bằng chứng

Harness chứng minh SQL chạy từ database rỗng theo đúng thứ tự, grant/policy
được tạo, trigger reply/last-admin/marker hoạt động và policy lọc đúng cho
caller giả lập. Nó **không** chứng minh:

- Supabase Cloud chấp nhận migration hoặc migration history;
- token/JWT thật, PostgREST, Auth hook hay email;
- migration replay trên baseline Cloud hiện tại;
- frontend/Spring gọi Data API.

Các tầng đó phải kiểm riêng sau khi owner duyệt gate.
